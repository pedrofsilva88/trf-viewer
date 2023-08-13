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
import { Bar, Container, Section } from '@column-resizer/react';
import { TrfDetailView } from './TrfDetailView';
import { TrfPrjListView } from './TrfPrjListView';

interface TrfPrjSummaryViewProps {
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
                    //const ms = distance
                    return `${hours}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
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
                    ]
                }
                newEntityTables.push(infoTable) // the first one will be shown outside the tabs
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

    return <div className={`trfPrjSummaryView${prefersDarkMode ? ' rs-theme-dark' : ''} `}>
        <Container vertical={true}>
            <Section minSize={100} defaultSize={sectionHeight.current} onSizeChanged={(curSize) => {
                sectionHeight.current = curSize // need to avoid re-render here so useRef...
                localStorage.setItem("prjSummary.SectionHeight", JSON.stringify(sectionHeight.current))
            }}
            >
                <div style={{ display: 'flex', flexFlow: 'column', height: '100%' }}>
                    <div style={{ flex: '0 1 auto' }}>
                        <div style={{ width: '100%', textAlign: 'center', fontSize: "1rem" }}>{`Summary: ${selected.name || selected.label}`}</div>
                        {selected.timestamp && <div style={{ width: '100%', textAlign: 'center', fontSize: "0.7rem" }}>{new Date(selected.timestamp * 1000).toString()}</div>}
                        {entityTables.length > 0 && <div style={{ padding: '0px 0px 48px 0px' }}>{tableFromTableEntity(entityTables[0], 'table_info')}</div>}
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
