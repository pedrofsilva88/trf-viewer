/**
 * todos:
 * [] add checkbox to show skipped items
 */

import { useLocalStorage, useMediaQuery } from 'usehooks-ts';
import { TrfReport, TrfReportItem } from './TrfWorkbenchView'
import { useEffect, useRef, useState } from 'react';

import './TrfPrjSummaryView.css'
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2'
import { Bar, Container, Section } from '@column-resizer/react';
import { TrfDetailView } from './TrfDetailView';
import { TrfPrjListView } from './TrfPrjListView';
import { TableEntity, getTableEntityCellTable, timeFormat } from './utils';

interface TrfPrjSummaryViewProps {
    trf: TrfReport,
    items: TrfReportItem[],
    selected: TrfReportItem
}

export const TrfPrjSummaryView = (props: TrfPrjSummaryViewProps) => {
    const { trf, selected } = props

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

    const [entityTables, setEntityTables] = useState<TableEntity[]>([])
    const [listSelectedItem, setListSelectedItem] = useState<TrfReportItem | undefined>(undefined)

    const [lsSectionHeight, _setLSSectionHeight] = useLocalStorage<number>("prjSummary.SectionHeight", 400)
    const sectionHeight = useRef<number>(lsSectionHeight)

    useEffect(() => {
        console.time(`TrfPrjSummaryView.useEffect[selected]...`)
        try {
            const newEntityTables: TableEntity[] = []
            {
                const infoTable: TableEntity = {
                    name: 'info',
                    columns: [
                        { key: 'attr', label: '', options: {} },
                        { key: 'value', label: '', options: {} }
                    ],
                    data: [
                        { attr: 'result:', value: (selected.result === 'NONE' && selected.children.length === 0) ? '(SKIPPED)' : selected.result },
                        { attr: 'execution mode:', value: trf.dbInfo.execution_mode },
                        { attr: 'duration [h:mm:ss]:', value: timeFormat(selected.duration || 0, false) },
                    ]
                }
                newEntityTables.push(infoTable) // the first one will be shown outside the tabs
            }
            {
                // any statistics?
                const resultRows: any[] =
                    trf.db.exec({ sql: `SELECT * from entity where reportitem_id=${selected.id};`, returnValue: 'resultRows', rowMode: 'object' })
                console.log(`TrfPrjSummaryView.useEffect[selected] got ${resultRows.length} entity rows for ${selected.id}`, resultRows)
                for (const row of resultRows) {
                    if (row.type === 'tableentity_cell' && row.name === 'Statistic') {
                        console.log(`TrfPrjSummaryView.useEffect[selected] got statistics row id:${row.id}`, row)
                        const statsTable = getTableEntityCellTable(trf.db, row.id, row.name)
                        for (const col of statsTable.columns) {
                            if (col.label === 'Percentage') {
                                col.options.formatter = (val) => Number(val).toFixed(2)
                                col.options.unit = '%'
                            }
                        }
                        newEntityTables.push(statsTable)
                    }
                }

            }

            setEntityTables(newEntityTables)
        } catch (e) {
            console.error(`TrfPrjSummaryView.useEffect[selected] got error:${e} `)
            setEntityTables([])
        }
        console.timeEnd(`TrfPrjSummaryView.useEffect[selected]...`)
        return () => {
            console.log(`TrfPrjSummaryView.useEffect[selected] unmount`)
        }
    }, [selected, trf.db, trf.dbInfo])

    const tableFromTableEntity = (et: TableEntity, key: string) => {
        return <div key={key} style={{ display: 'table', padding: '6px 0px 4px 0px' }}>
            <TableContainer /*component={Paper}*/>
                <Table sx={{ minWidth: 200 }} size="small" padding='none'>
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
                                    {((col.options.formatter ? col.options.formatter(row[col.key]) : row[col.key]) || '') + (col.options.unit ? col.options.unit : '')}
                                </TableCell> : <TableCell key={col.key}>{((col.options.formatter ? col.options.formatter(row[col.key]) : row[col.key]) || '') + (col.options.unit ? col.options.unit : '')}</TableCell>)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    }

    return <div className={`trfPrjSummaryView${prefersDarkMode ? ' rs-theme-dark' : ''} `}>
        <Container vertical={true}>
            <Section minSize={100} defaultSize={sectionHeight.current} onSizeChanged={(curSize) => {
                sectionHeight.current = curSize // need to avoid re-render here so useRef...
                localStorage.setItem("prjSummary.SectionHeight", JSON.stringify(sectionHeight.current))
            }}
            >
                <div style={{ display: 'flex', flexFlow: 'column', height: '100%' }}>
                    <div style={{ flex: '0 1 auto' }}>
                        <div style={{ width: '100%', textAlign: 'right', fontSize: "0.6rem" }}>{`${(trf.dbInfo.app_name || '') + `:${trf.dbInfo.app_version || ''}`}`}</div>
                        <div style={{ width: '100%', textAlign: 'center', fontSize: "1rem" }}>{`Summary: ${selected.name || selected.label}`}</div>
                        {selected.timestamp && <div style={{ width: '100%', textAlign: 'center', fontSize: "0.7rem" }}>{new Date(selected.timestamp * 1000).toString()}</div>}
                        <Grid container>
                            <Grid>{entityTables.length > 0 && <div style={{ padding: '0px 0px 4px 0px' }}>{tableFromTableEntity(entityTables[0], 'table_info')}</div>}</Grid>
                            <Grid xsOffset={"auto"}>{entityTables.length > 1 && <div style={{ padding: '0px 4px 0px 0px' }}>{tableFromTableEntity(entityTables[1], `table_${entityTables[1].name || 1}`)}</div>}</Grid>
                        </Grid>
                        <Divider textAlign="left">detailed report</Divider>
                    </div>
                    <div style={{ flex: '1 1 auto', maxHeight: '100%', display: 'content' }}>
                        {entityTables.length /* if entityTables get rendered the size changes */
                            && <TrfPrjListView trf={trf}
                                items={[{ idx: 1, ...selected }, ...selected.children.map((i, idx) => { return { idx: idx + 2, ...i } }).filter((i) => !(i.result === 'NONE' && i.children.length === 0))]}
                                onSelect={(_viewType, _nodeId, node) => {
                                    // console.log(`TrfPrjSummaryView prjListView.onSelect(${viewType}${nodeId})`)
                                    setListSelectedItem(node)
                                }} />}
                    </div>
                </div>
            </Section>
            <Bar size={6} style={{ background: 'currentColor', cursor: 'col-resize' }} />
            <Section minSize={50} >
                {!listSelectedItem && <div>No pkg selected</div>}
                {listSelectedItem && <TrfDetailView items={props.items} selected={listSelectedItem} trf={props.trf} />}
            </Section>
        </Container>
    </div >
}
