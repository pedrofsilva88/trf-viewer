import { useState, useCallback, useEffect, useMemo } from 'react'

import { Chart as ChartJS, ArcElement, BarController, Title, Tooltip, Legend, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { fromEvent } from 'file-selector';
import { Buffer } from 'node:buffer'

ChartJS.register(ArcElement, BarController, Tooltip, Legend, Title, ChartDataLabels, ...registerables); // todo optimize/get rid of registerables

import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { ConfirmProvider } from "material-ui-confirm";
import { SnackbarProvider, enqueueSnackbar } from 'notistack'

import './App.css'
import Dropzone, { FileRejection } from 'react-dropzone';
import AdmZip from 'adm-zip';
import { AppBar, Box, CssBaseline, IconButton, Menu, Toolbar, Tooltip as MuiTooltip, Typography, alpha, styled } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import DifferenceIcon from '@mui/icons-material/Difference';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { DB, Sqlite3 } from '@sqlite.org/sqlite-wasm';

import { Sqlite3Context, useSqliteInitEffect } from './sqlite3';
import { TrfWorkbenchView, TrfReport } from './TrfWorkbenchView';

// supported (as known) db_version:
const DB_VERSION_MIN = 64
const DB_VERSION_MAX = 64

const isSameFile = (a: File, b: File): boolean => {
  return a.name === b.name && a.type === b.type && a.lastModified === b.lastModified;
}

const includesFile = (a: File[], b: File): boolean => {
  return a.find(f => isSameFile(f, b)) !== undefined
}

/*
const useLocalStorage = <T,>(storageKey: string, initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setVal] = useState<T>(() => {
    const storedItem = window.localStorage.getItem(storageKey)
    if (storedItem !== null) {
      return JSON.parse(storedItem) as T
    } else {
      return initialState
    }
  })

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(value))
  }, [value, storageKey])

  return [value, setVal]
}*/

function App() {
  // const [referenceIdToCompare, setReferenceIdToCompare] = useLocalStorage<number>('referenceIdToCompare', 0) // the db.Reference.id to compare with (seems like 0 is not used...)
  const [files, setFiles] = useState<File[]>([])
  const [testReports, setTestReports] = useState<TrfReport[]>([])
  //  const [showDetailTCs, setShowDetailTCs] = useState<AtxTestCase[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: FileRejection[],) => {
    let didSetFiles = false;
    setLoading(true)
    try {
      //const length = event.dataTransfer.files.length;
      console.log(`onDrop acceptedFile length=${acceptedFiles.length} rejectedFiles: ${rejectedFiles.length}`);
      const posTrfFiles = acceptedFiles.filter((f) => { const lowName = f.name.toLowerCase(); return lowName.endsWith('.trf') })
      // we do only check for zip files if no xml file was dropped already
      const zipFiles = posTrfFiles.length === 0 ? acceptedFiles.filter((f) => { const lowName = f.name.toLowerCase(); return lowName.endsWith('.zip') || lowName.endsWith('.7z') }) : []
      for (const file of zipFiles) {
        console.log(` dropped zip file:${file.name} ${file.type} size=${file.size}`, file)
        const fileBuf = await file.arrayBuffer()
        console.log(` dropped zip file:${file.name} size=${file.size} got fileBuf ${fileBuf.byteLength}`)
        const zip = new AdmZip(Buffer.from(fileBuf), { noSort: true })
        console.log(` dropped zip file:${file.name} has ${zip.getEntryCount()} entries.`)
        const trfFilesFromZip = zip.getEntries().filter((e) => {
          const lowName = e.entryName.toLowerCase();
          return lowName.endsWith('.trf')
        })
        console.log(` dropped zip file:${file.name} has ${trfFilesFromZip.length} trf entries`)
        // unzip those:
        const trfFilesFromZipAsFiles = trfFilesFromZip.map((f) => {
          const bits = f.getData()
          return new File([bits], f.entryName, { type: "text/xml", lastModified: f.header.time.valueOf() }) // todo text/xml
        })
        console.log(` dropped zip file:${file.name} extracted ${trfFilesFromZipAsFiles.length} trf entries`, trfFilesFromZipAsFiles)
        setFiles(d => {
          const nonDuplFiles = trfFilesFromZipAsFiles.filter(f => !includesFile(d, f));
          return d.concat(nonDuplFiles)
        })
        didSetFiles = true
      }
      if (posTrfFiles.length > 0) {
        setFiles(d => {
          const nonDuplFiles = posTrfFiles.filter(f => !includesFile(d, f));
          return d.concat(nonDuplFiles)
        })
        didSetFiles = true
      }
    } catch (err) {
      console.error(`onDrop got err=${err}`);
    }
    if (!didSetFiles) {
      setLoading(false)
    }
  }, [])

  const [sqlite3, setSqlite3] = useState<Sqlite3 | undefined>(undefined)
  useSqliteInitEffect(setSqlite3)

  // load/open the files as sqlite databases
  useEffect(() => {
    if (sqlite3 !== undefined) {
      console.log(`App.useEffect[files]... files=${files.map((f => f.name)).join(',')}`)
      Promise.all(files.map(file => {
        const arrayBuffer = file.arrayBuffer()
        return arrayBuffer.then(a => [a, file.name] as [ArrayBuffer, string])
      }))
        .then(arrayBuffers => {
          const uint8Arrays = arrayBuffers.map(([arrayBuffer, fileName]) => [new Uint8Array(arrayBuffer), fileName] as [Uint8Array, string])
          const dbs = uint8Arrays.map(([bytes, fileName]) => {
            const p = sqlite3.wasm.allocFromTypedArray(bytes);
            const db = new sqlite3.oo1.DB();
            let rc = sqlite3.capi.sqlite3_deserialize(
              db.pointer,
              "main",
              p,
              bytes.length,
              bytes.length,
              0
            );
            console.log(`sqlite3_deserialize got rc=${rc}`)
            return [db, fileName] as [DB, string] // todo only if rc===0?
          })
          const reports: (TrfReport | undefined)[] = dbs.map(([db, fileName]) => {
            console.log(`db(${fileName}).dbName=`, db.dbName())
            const info: any[] = db.exec({ sql: "SELECT * from info limit 1; ", returnValue: "resultRows", rowMode: "object" })
            if (info.length > 0) {
              console.log(`db.info[0]=`, info[0])
              if (info[0].db_version < DB_VERSION_MIN) {
                enqueueSnackbar(`Un-known/-tested (too old) db version ${info[0].db_version} < ${DB_VERSION_MIN}. Please report any issues.`,
                  { preventDuplicate: true, variant: 'warning', autoHideDuration: 9000 })
              } else if (info[0].db_version > DB_VERSION_MAX) {
                enqueueSnackbar(`Un-known/-tested (newer) db version ${info[0].db_version} > ${DB_VERSION_MAX}. Please report any issues.`,
                  { preventDuplicate: true, variant: 'warning', autoHideDuration: 9000 })
              }
              return {
                fileName: fileName,
                db: db,
                dbInfo: info[0]
              }
            } else return undefined
          })
          // todo remove duplicates by uuid (or uuid/execution_time?)
          // todo sort by execution date
          return reports.filter(r => r !== undefined) as TrfReport[]
        }
        )
        .then(reports => { setLoading(false); if (reports) setTestReports(reports) })
        .catch(e => {
          console.error(`App.useEffect[files]... got error '${e}'`)
          setLoading(false)
        })
    } else {
      if (files.length > 0) {
        console.warn(`App.useEffect[files] got no sqlite3!  files=${files.map((f => f.name)).join(',')}`)
      }
    }
  }, [sqlite3, files, setLoading, setTestReports])

  const Drop = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));

  const [compareMenuAnchorEl, setCompareMenuAnchorEl] = useState<null | HTMLElement>(null)
  const handleCompareMenu = (event: React.MouseEvent<HTMLElement>) => {
    setCompareMenuAnchorEl(event.currentTarget)
  }
  const handleCompareMenuClose = () => {
    setCompareMenuAnchorEl(null)
  }

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(() => createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light'
    },
  }), [prefersDarkMode])

  return (
    <SnackbarProvider >
    <Sqlite3Context.Provider value={sqlite3}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ConfirmProvider >

        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" color='primary'>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                trf viewer
              </Typography>
              <Drop>
                <Dropzone onDrop={onDrop} getFilesFromEvent={fromEvent}>
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps({ className: 'dropZone' })}>
                        {false && <IconButton
                          size="large"
                          edge="start"
                          color="inherit"
                          aria-label="add files"
                          sx={{ mr: 2 }}
                        >
                          <AddIcon />
                        </IconButton>}
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop files here, or click to select files</p>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </Drop>
              <IconButton aria-label='clear reports' size='large' color='inherit'
                  disabled={!(files.length > 0 || testReports.length > 0)}
                  onClick={() => { setFiles([]); setTestReports([]); /*setReferenceIdToCompare(0)*/ }}>
                <MuiTooltip title="Clear reports">
                  <DeleteForeverIcon />
                </MuiTooltip>
              </IconButton>
              <div>
                <IconButton size="large" aria-controls='menu-compare' aria-haspopup='true' onClick={handleCompareMenu} color='inherit'>
                  <MuiTooltip title="Compare report">
                    <DifferenceIcon />
                  </MuiTooltip>
                </IconButton>
                <Menu id="menu-compare"
                  anchorEl={compareMenuAnchorEl}
                  keepMounted
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={!!compareMenuAnchorEl}
                  onClose={handleCompareMenuClose}
                  PaperProps={{
                    style: {
                      height: 300,
                    },
                  }}
                >
                </Menu>
              </div>
              <div>
                <IconButton disabled={true} size='large' color='inherit'>
                  <MuiTooltip title="Filter test cases...">
                    <FilterAltIcon />
                  </MuiTooltip>
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
        </Box>
        {loading && <>
          <div id="progress" className='indeterminateProgressBar'><div className='indeterminateProgressBarProgress' /></div></>}
        <div className="card">
            {testReports.length === 0 /*&& compareView === undefined */ && <p>
            Open a trf test report file...
          </p>}
            {testReports.length > 0 && testReports.map((report, idx) => <TrfWorkbenchView key={`rep_${idx}`} trf={report} />)}
        </div>
        {false && files.length > 0 &&
          files.map((f: File) => (typeof f.name === 'string' ? f.name : '')).join(',') || ''}
        <div className='gitSha'>build from <a href="https://github.com/mbehr1/trf-viewer" target="_blank">github/mbehr1/trf-viewer</a> commit #{__COMMIT_HASH__}</div>
      </ConfirmProvider>
    </ThemeProvider>
    </Sqlite3Context.Provider >
    </SnackbarProvider>
  )
}

export default App
