/**
 * todos:
 * [] add recording_mapping item info
 * [] add export/open if a zip file was provided where the file is contained
 */

import { useMediaQuery } from 'usehooks-ts';
import { ItemType, TrfReport, TrfReportItem } from './TrfWorkbenchView'
import { useEffect, useState } from 'react';

import './TrfPkgRecordingsView.css'
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

interface TrfPkgRecordingsViewProps {
    trf: TrfReport,
    items: TrfReportItem[],
    pkgItems: TrfReportItem[], // the tree items where we need to lookup the selected.id from
    selected: TrfReportItem
}

interface TableColumn {
    key: string,
    label?: string
    downloadable?: (label: string) => boolean,
    download?: (label: string) => void,
}

interface TableEntity {
    name?: string,
    columns: TableColumn[],
    data: { [key: string]: string }[]
}

export const TrfPkgRecordingsView = (props: TrfPkgRecordingsViewProps) => {
    const { trf, selected } = props

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

    const [reportItemRecordings, setReportItemRecordings] = useState<{ reportitem_id: number, recording_id: number }[]>([])

    const [entityTables, setEntityTables] = useState<TableEntity[]>([])

    // map the selected one (which is a testcase type) to the tree item:
    useEffect(() => {
        console.log(`TrfPkgRecordingsView.useEffect[props.pkgItems, selected]...`)
        for (const roots of props.pkgItems) {
            for (const pkg of roots.children) {
                const item = pkg.children.find(i => i.itemType === ItemType.Recordings && i.id === selected.id)
                if (item) {
                    const recordings = item._internalData?.["recordings"]
                    setReportItemRecordings(Array.isArray(recordings) ? recordings : [])
                    break;
                }
            }
        }
    }, [props.pkgItems, selected])

    useEffect(() => {
        console.log(`TrfPkgRecordingsView.useEffect[reportItemRecordings]... reportItemRecordings`, reportItemRecordings)

    }, [reportItemRecordings])

    useEffect(() => {
        console.time(`TrfPkgRecordingsView.useEffect[selected]...`)
        try {
            const newEntityTables: TableEntity[] = []
            {
                const recordingsTable: TableEntity = {
                    name: "attributes",
                    columns: [
                        { key: 'groupname', label: 'group name' },
                        { key: 'name', label: 'name' },
                        { key: 'type', label: 'type' },
                        {
                            key: 'path', label: 'path', downloadable: (label: string) => {
                                if (trf.fileData.deferredZipFile) {
                                    const lastPathDelimiter = trf.fileData.file.name.lastIndexOf('/')
                                    const basePath = lastPathDelimiter > 0 ? trf.fileData.file.name.slice(0, lastPathDelimiter + 1) : ''
                                    const recordingPath = basePath + (label as string).replaceAll('\\', '/')
                                    if (trf.fileData.deferredZipFile.includes(recordingPath)) {
                                        console.log(`TrfPkgRecordingsView got deferred file:'${recordingPath}' for '${trf.fileData.file.name}'`)
                                        return true
                                    } else {
                                        console.log(`TrfPkgRecordingsView got no deferred file: for '${recordingPath}' from '${trf.fileData.file.name}'`)
                                    }
                                }
                                return false
                            },
                            download: async (label: string) => {
                                console.log(`download(${label})...`)
                                const lastPathDelimiter = trf.fileData.file.name.lastIndexOf('/')
                                const basePath = lastPathDelimiter > 0 ? trf.fileData.file.name.slice(0, lastPathDelimiter + 1) : ''
                                const recordingPath = basePath + (label as string).replaceAll('\\', '/')
                                const files = await trf.fileData.deferredZipFile?.extract([recordingPath])
                                if (files && files.length > 0) {
                                    for (const file of files) {
                                        const url = window.URL.createObjectURL(
                                            file,
                                        );
                                        const link = document.createElement('a')
                                        link.href = url
                                        link.setAttribute(
                                            'download',
                                            recordingPath,
                                        )

                                        // Append to html link element page
                                        document.body.appendChild(link)

                                        // Start download
                                        link.click()

                                        // Clean up and remove the link
                                        link.parentNode?.removeChild(link)
                                        window.URL.revokeObjectURL(url)
                                    }
                                }
                            }
                        },
                        { key: 'signalgroup_name', label: 'signal group name' },
                        { key: 'signalgroup_description', label: 'signal group description' },
                    ],
                    data: []
                }
                const setRecordingIds = new Set<number>()
                for (const rIRecord of reportItemRecordings) {
                    if (setRecordingIds.has(rIRecord.recording_id)) {
                        continue; // we do have this recording already
                    } else {
                        setRecordingIds.add(rIRecord.recording_id)
                    }
                    const resultRows: any[] =
                        trf.db.exec({ sql: `select recording.*, signalgroup.name as signalgroup_name, signalgroup.description as signalgroup_description  from recording join signalgroup on recording.signalgroup_id = signalgroup.id where recording.id = ${rIRecord.recording_id}; `, returnValue: 'resultRows', rowMode: 'object' })
                    if (resultRows.length) {
                        for (const row of resultRows) {
                            recordingsTable.data.push(row)
                        }
                    }
                }
                newEntityTables.push(recordingsTable)
            }
            setEntityTables(newEntityTables)

            console.timeEnd(`TrfPkgRecordingsView.useEffect[selected]...`)
        } catch (e) {
            console.error(`TrfPkgRecordingsView.useEffect[selected] got error:${e} `)
            setEntityTables([])
        }
        return () => {
            console.log(`TrfPkgRecordingsView.useEffect[selected] unmount`)
        }
    }, [selected, trf.db, reportItemRecordings])

    const tableFromTableEntity = (et: TableEntity, key: string) => {
        return <div key={key} style={{ display: 'table', padding: '6px 0px 4px 0px' }}>
            <TableContainer /*component={Paper}*/>
                <Table sx={{ minWidth: 300 }} size="small" padding='none'>
                    <TableHead>
                        <TableRow>
                            {et.columns.map((col) => <TableCell key={col.key}>{col.label || ''}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {et.data.map((row, idx) => (
                            <TableRow
                                key={idx}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {et.columns.map((col, idx) => idx === 0 ? <TableCell key={col.key} component="th" scope="row">
                                    {row[col.key] || ''}
                                </TableCell> : <TableCell key={col.key}>{col.downloadable && col.downloadable(row[col.key]) ? <Button size="small" component={Link} onClick={() => { if (col.download) { col.download(row[col.key]) } }}>{row[col.key] || ''}</Button> : (row[col.key] || '')}</TableCell>)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    }

    return <div data-testid='trfPkgRecordingsView' className={`trfPkgRecordingsView${prefersDarkMode ? ' rs-theme-dark' : ''} `}>
        <div style={{ width: '100%', textAlign: 'center', fontSize: "1rem" }}>{`Recordings from ${selected.name || selected.label}`}</div>
        {entityTables.length > 0 && <div style={{ padding: '0px 0px 48px 0px' }}>{tableFromTableEntity(entityTables[0], 'table_info')}</div>}
    </div >
}
