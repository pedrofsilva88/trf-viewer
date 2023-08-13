/**
 * todos:
 * [] add more tabs (test config, test bench config)
 */

import { useMediaQuery } from 'usehooks-ts';
import { TrfReport, TrfReportItem } from './TrfWorkbenchView'
import { useEffect, useMemo, useState } from 'react';

import './TrfPkgSummaryView.css'
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';

interface TrfPkgSummaryViewProps {
    trf: TrfReport,
    items: TrfReportItem[],
    selected: TrfReportItem
}

interface TableColumn {
    key: string,
    label?: string
}

interface TableEntity {
    name?: string,
    columns: TableColumn[],
    data: { [key: string]: string }[]
}

export const TrfPkgSummaryView = (props: TrfPkgSummaryViewProps) => {
    const { trf, selected } = props

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

    const [entityTables, setEntityTables] = useState<TableEntity[]>([])
    const [visibleTab, setVisibleTab] = useState(0)

    useEffect(() => {
        console.time(`TrfPkgSummaryView.useEffect[selected]...`)
        try {
            const newEntityTables: TableEntity[] = []
            {
                const duration = selected.duration || 0

                const timeFormat = (distance: number) => {
                    //const days = Math.floor(distance / (3600 * 24))
                    //distance -= days * (3600 * 24)
                    const hours = Math.floor(distance / 3600)
                    distance -= hours * 3600
                    const minutes = Math.floor(distance / 60)
                    distance -= minutes * 60
                    const seconds = Math.floor(distance)
                    distance -= seconds
                    const ms = distance
                    return `${hours}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}.${ms.toFixed(3).slice(2)}`;
                }

                const infoTable: TableEntity = {
                    name: 'info',
                    columns: [
                        { key: 'attr', label: '' },
                        { key: 'value', label: '' }
                    ],
                    data: [
                        { attr: 'result:', value: (selected.result === 'NONE' && selected.children.length === 0) ? '(SKIPPED)' : selected.result },
                        { attr: 'execution mode:', value: trf.dbInfo.execution_mode },
                        { attr: 'duration:', value: timeFormat(duration) },
                        { attr: 'comment:', value: selected.comment },
                        { attr: 'file:', value: selected.info },
                        { attr: 'test pc:', value: trf.dbInfo.teststand },
                        { attr: 'swk version:', value: trf.dbInfo.swk_version },
                    ]
                }
                newEntityTables.push(infoTable) // the first one will be shown outside the tabs
            }
            {
                const resultRows: any[] =
                    trf.db.exec({ sql: `SELECT * from attribute where reportitem_id = ${selected.id}; `, returnValue: 'resultRows', rowMode: 'object' })
                console.log(`TrfPkgSummaryView.useEffect[selected] got ${resultRows.length} attribute rows for ${selected.id}`)

                const attrTable: TableEntity = {
                    name: "attributes",
                    columns: [
                        { key: 'name', label: 'name' },
                        { key: 'value', label: 'value' },
                        { key: 'origin', label: 'origin' },
                    ],
                    data: resultRows
                }
                newEntityTables.push(attrTable)
            }
            {
                const resultRows: any[] =
                    trf.db.exec({ sql: `SELECT * from constant; `, returnValue: 'resultRows', rowMode: 'object' })
                // todo check whether callback or rowMode array is faster
                console.log(`TrfPkgSummaryView.useEffect[selected] got ${resultRows.length} constant rows`)

                const constsTable: TableEntity = {
                    name: "global constants",
                    columns: [
                        { key: 'name', label: 'name' },
                        { key: 'value', label: 'value' },
                        { key: 'description', label: 'description' },
                        { key: 'origin', label: 'origin' },
                    ],
                    data: resultRows
                }
                newEntityTables.push(constsTable)
            }
            {
                const resultRows: any[] =
                    trf.db.exec({ sql: `SELECT * from libraries; `, returnValue: 'resultRows', rowMode: 'object' })
                // todo check whether callback or rowMode array is faster
                console.log(`TrfPkgSummaryView.useEffect[selected] got ${resultRows.length} libraries rows`)

                const constsTable: TableEntity = {
                    name: "libraries",
                    columns: [
                        { key: 'titel', label: 'title' },
                        { key: 'version', label: 'version' },
                        { key: 'namespace', label: 'namespace' },
                        { key: 'path', label: 'path' },
                    ],
                    data: resultRows
                }
                newEntityTables.push(constsTable)
            }

            setEntityTables(newEntityTables)

            console.timeEnd(`TrfPkgSummaryView.useEffect[selected]...`)
        } catch (e) {
            console.error(`TrfPkgSummaryView.useEffect[selected] got error:${e} `)
            setEntityTables([])
        }
        return () => {
            console.log(`TrfPkgSummaryView.useEffect[selected] unmount`)
        }
    }, [selected, trf.db, trf.dbInfo])

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setVisibleTab(newValue);
    };

    const tabs = useMemo(() => {
        function a11yProps(index: number) {
            return {
                id: `simple - tab - ${index} `,
                'aria-controls': `simple - tabpanel - ${index} `,
            };
        }

        interface StyledTabProps {
            label: string;
        }
        const StyledTab = styled((props: StyledTabProps) => (
            <Tab disableRipple {...props} />
        ))(({ theme }) => ({
            textTransform: 'none',
            fontWeight: theme.typography.fontWeightRegular,
            fontSize: '0.7rem', //theme.typography.pxToRem(15),
            marginRight: theme.spacing(1),
            color: theme.palette.text.secondary,
            '&.Mui-selected': {
                color: theme.palette.text.primary,
            },

        }));

        return entityTables.slice(1).map((et, idx) => <StyledTab label={et.name || `table ${idx} `} {...a11yProps(idx)} />)
    }, [entityTables])

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
                                </TableCell> : <TableCell key={col.key}>{row[col.key] || ''}</TableCell>)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    }

    const panels = useMemo(() => {
        // todo or simply just the visible one?

        interface TabPanelProps {
            children?: React.ReactNode;
            index: number;
            value: number;
        }

        function CustomTabPanel(props: TabPanelProps) {
            const { children, value, index, ...other } = props;

            return (
                <div
                    role="tabpanel"
                    hidden={value !== index}
                    id={`simple - tabpanel - ${index} `}
                    aria-labelledby={`simple - tab - ${index} `}
                    {...other}
                >
                    {value === index && (
                        <div>{children}</div>
                    )}
                </div>
            );
        }

        return entityTables.slice(1).map((et, idx) => <CustomTabPanel value={visibleTab} index={idx}>
            {tableFromTableEntity(et, `div_et_${idx} `)}
        </CustomTabPanel>)
    }, [entityTables, visibleTab])

    return <div className={`trfPkgSummaryView${prefersDarkMode ? ' rs-theme-dark' : ''} `}>
        <div style={{ width: '100%', textAlign: 'center', fontSize: "1rem" }}>{selected.name || selected.label}</div>
        {selected.timestamp && <div style={{ width: '100%', textAlign: 'center', fontSize: "0.7rem" }}>{new Date(selected.timestamp * 1000).toString()}</div>}
        {entityTables.length > 0 && <div style={{ padding: '0px 0px 48px 0px' }}>{tableFromTableEntity(entityTables[0], 'table_info')}</div>}
        <Divider />
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={visibleTab} onChange={handleTabChange} indicatorColor='primary' sx={{ minWidth: 24 }}>
                    {tabs}
                </Tabs>
            </Box>
            {panels}
        </Box>
    </div >
}
