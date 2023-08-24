/**
 * todos:
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
import { timeFormat } from './utils';

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
                const infoTable: TableEntity = {
                    name: 'info',
                    columns: [
                        { key: 'attr', label: '' },
                        { key: 'value', label: '' }
                    ],
                    data: [
                        { attr: 'result:', value: (selected.result === 'NONE' && selected.children.length === 0) ? '(SKIPPED)' : selected.result },
                        { attr: 'execution mode:', value: trf.dbInfo.execution_mode },
                        { attr: 'duration:', value: timeFormat(selected.duration || 0, true) },
                        { attr: 'comment:', value: selected.comment },
                        { attr: 'file:', value: selected.info },
                        { attr: 'test pc:', value: trf.dbInfo.teststand },
                        { attr: 'swk version:', value: trf.dbInfo.swk_version },
                    ]
                }
                newEntityTables.push(infoTable) // the first one will be shown outside the tabs
            }
            {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                const resultRows: { name: string, value: string, description: string, origin: string }[] =
                    trf.db.exec({ sql: `SELECT * from constant; `, returnValue: 'resultRows', rowMode: 'object' })
                // todo check whether callback or rowMode array is faster
                console.log(`TrfPkgSummaryView.useEffect[selected] got ${resultRows.length} constant rows`)
                // sort by name
                resultRows.sort((a, b) => {
                    const na: string = a.name || ''
                    const nb: string = b.name || ''
                    return na.localeCompare(nb)
                })
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const resultRows: any[] =
                    trf.db.exec({ sql: `SELECT tcf.* from tcf join ctx on tcf.id = ctx.tcf_id join reportitem on reportitem.ctx_id=ctx.id where reportitem.id =${selected.id}; `, returnValue: 'resultRows', rowMode: 'object' })
                //console.log(`TrfPkgSummaryView.useEffect[selected] got ${resultRows.length} tbc rows`)
                if (resultRows.length === 1) {
                    const constsTable: TableEntity = {
                        name: "test config",
                        columns: [
                            { key: 'cat' },
                            { key: 'name' },
                            { key: 'value' },
                        ],
                        data: [
                            { cat: 'config file', value: resultRows[0].path },
                            { cat: 'general' },
                            { name: 'tester', value: resultRows[0].editor },
                            { name: 'data dir', value: resultRows[0].datadir },
                            { name: 'package dir', value: resultRows[0].pkgdir },
                        ]
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const rrMappings: any[] =
                        trf.db.exec({ sql: `SELECT * from tcf_mappingfile where tcf_id = ${resultRows[0].id};`, returnValue: 'resultRows', rowMode: 'object' })
                    const data = constsTable.data
                    for (const mapping of rrMappings as { filename: string }[]) {
                        data.push({ name: "global mapping file", value: mapping.filename })
                    }
                    // todo add tcf_execution
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const rrEcus: any[] =
                        trf.db.exec({ sql: `SELECT * from tcf_ecu where tcf_id = ${resultRows[0].id};`, returnValue: 'resultRows', rowMode: 'object' })
                    for (const ecu of rrEcus as { [key: string]: string }[]) {
                        data.push({ cat: `ECUs: ${ecu.id || ''}`, })
                        data.push({ name: "A2l file", value: ecu.a2lfile })
                        data.push({ name: "hex file", value: ecu.hexfile })
                        data.push({ name: "diagnosis db", value: ecu.diagnostic_db })
                        data.push({ name: "SGBD", value: `${ecu.sgbd || ''} (Version: ${ecu.sgbd_version || ''})` })
                        data.push({ name: "LogicalLink", value: ecu.logilink })
                        data.push({ name: "ELF", value: ecu.elf })
                        data.push({ name: "DEBUG-HEX", value: ecu.debug_hex })
                        data.push({ name: "DLT db", value: ecu.log_database })
                        data.push({ name: "DLT filter file", value: ecu.log_filter_file })
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const rrBus: any[] =
                        trf.db.exec({ sql: `SELECT * from tcf_bus where tcf_id = ${resultRows[0].id} order by id;`, returnValue: 'resultRows', rowMode: 'object' })
                    for (const bus of rrBus as { [key: string]: string }[]) {
                        data.push({ cat: `bus: ${bus.id || ''}`, })
                        data.push({ name: "database", value: bus.dbpath })
                        data.push({ name: "fibex channel", value: bus.fbxchn })
                    }

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const rrConsts: any[] =
                        trf.db.exec({ sql: `SELECT * from tcf_const where tcf_id = ${resultRows[0].id};`, returnValue: 'resultRows', rowMode: 'object' })
                    if (rrConsts.length) {
                        data.push({ cat: `constants definition files`, })
                        for (const rrConst of rrConsts as { [key: string]: string }[]) {
                            data.push({ name: rrConst.const_file })
                        }
                    }

                    newEntityTables.push(constsTable)
                } else {
                    console.warn(`TrfPkgSummaryView.useEffect[selected] got unexpected #${resultRows.length} tbc rows!`)
                }
            }

            {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const resultRows: any[] =
                    trf.db.exec({ sql: `SELECT tbc.* from tbc join ctx on tbc.id = ctx.tbc_id join reportitem on reportitem.ctx_id=ctx.id where reportitem.id =${selected.id}; `, returnValue: 'resultRows', rowMode: 'object' })
                //console.log(`TrfPkgSummaryView.useEffect[selected] got ${resultRows.length} tbc rows`)
                if (resultRows.length === 1) {
                    const constsTable: TableEntity = {
                        name: "testbench config",
                        columns: [
                            { key: 'cat' },
                            { key: 'name' },
                            { key: 'value' },
                        ],
                        data: [{
                            cat: 'config file',
                            value: resultRows[0].path
                        }]
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const resultRows2: any[] =
                        trf.db.exec({ sql: `SELECT * from tbc_tool where tbc_id = ${resultRows[0].id} order by id; `, returnValue: 'resultRows', rowMode: 'object' })
                    //console.log(`TrfPkgSummaryView.useEffect[selected] got ${resultRows2.length} tbc_tool rows`)
                    const data = constsTable.data
                    for (const tool of resultRows2 as { name: string, version: string, status: string, location: string, patches: string }[]) {
                        data.push({ cat: tool.name })
                        data.push({ name: "host", value: tool.location })
                        data.push({ name: "state", value: tool.status })
                        data.push({ name: "version", value: tool.version })
                        data.push({ name: "loaded patches", value: tool.patches })
                    }

                    newEntityTables.push(constsTable)
                } else {
                    console.warn(`TrfPkgSummaryView.useEffect[selected] got unexpected #${resultRows.length} tbc rows!`)
                }
            }
            {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        return entityTables.slice(1).map((et, idx) => <StyledTab key={`tab_${idx}`} label={et.name || `table ${idx} `} {...a11yProps(idx)} />)
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
                    id={`tabpanel_${index} `}
                    {...other}
                >
                    {value === index && (
                        <div>{children}</div>
                    )}
                </div>
            );
        }

        return entityTables.slice(1).map((et, idx) => <CustomTabPanel key={`tabpanel_${et.name || 'n'}`} value={visibleTab} index={idx}>
            {tableFromTableEntity(et, `div_et_${idx} `)}
        </CustomTabPanel>)
    }, [entityTables, visibleTab])

    return <div data-testid='trfPkgSummaryView' className={`trfPkgSummaryView${prefersDarkMode ? ' rs-theme-dark' : ''} `}>
        <div style={{ width: '100%', textAlign: 'center', fontSize: "1rem" }}>{selected.name || selected.label}</div>
        {selected.timestamp && <div style={{ width: '100%', textAlign: 'center', fontSize: "0.7rem" }}>{new Date(selected.timestamp * 1000).toString()}</div>}
        {entityTables.length > 0 && <div style={{ padding: '0px 0px 48px 0px' }}>{tableFromTableEntity(entityTables[0], 'table_info')}</div>}
        <Divider />
        <Box sx={{ width: '100%' }}>
            <Box key={`tabs_box`} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={visibleTab} onChange={handleTabChange} indicatorColor='primary' sx={{ minWidth: 24 }}>
                    {tabs}
                </Tabs>
            </Box>
            {panels}
        </Box>
    </div >
}
