import { useMediaQuery } from 'usehooks-ts';
import { TrfReport, TrfReportItem } from './TrfWorkbenchView'
import { useEffect, useState } from 'react';

import './TrfDetailView.css'
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';

interface TrfDetailViewProps {
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
    data: Map<string, string>[]
}

export const TrfDetailView = (props: TrfDetailViewProps) => {
    const { trf, selected } = props

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

    const [entityTables, setEntityTables] = useState<TableEntity[]>([])

    useEffect(() => {
        console.time(`TrfDetailView.useEffect[selected]...`)
        try {
            const resultRows: any[] =
                trf.db.exec({ sql: `SELECT * from entity where reportitem_id=${selected.id};`, returnValue: 'resultRows', rowMode: 'object' })
            // todo check whether callback or rowMode array is faster
            console.log(`TrfDetailView.useEffect[selected] got ${resultRows.length} entity rows for ${selected.id}`)
            console.timeLog(`TrfDetailView.useEffect[selected]...`)
            const newEntityTables: TableEntity[] = []
            for (const entity of resultRows) {
                if (entity.type === 'tableentity_cell') {
                    //console.log(`TrfDetailView.useEffect[selected] got table '${entity.name || ''}'`)
                    const resultRows: any[] =
                        trf.db.exec({ sql: `SELECT row, col, value from tableentity_cell where entity_id=${entity.id};`, returnValue: 'resultRows', rowMode: 'array' })
                    // sort by row/col:
                    resultRows.sort((a, b) => a[0] === b[0] ? (a[1] - b[1]) : (a[0] - b[0]))
                    //console.log(`TrfDetailView.useEffect[selected] got ${resultRows.length} sorted entity rows`, resultRows)
                    // determine max col:
                    const maxCol = resultRows.reduce((prev, cur) => cur[1] > prev ? cur[1] : prev, -1)
                    // determine columns:
                    const columns: TableColumn[] = []
                    for (const rowCell of resultRows) {
                        if (rowCell[0] > 0) { break }
                        const col = rowCell[1]
                        while (columns.length < col) {
                            columns.push({ key: columns.length.toString() })
                        }
                        columns.push({ key: columns.length.toString(), label: rowCell[2] })
                    }
                    // fill missing columns:
                    while (columns.length < maxCol + 1) {
                        columns.push({ key: columns.length.toString() })
                    }
                    // fill data
                    const data: Map<string, string>[] = []
                    for (const rowCell of resultRows) {
                        if (rowCell[0] <= 0) { continue }
                        const row = rowCell[0] - 1
                        const col = rowCell[1]
                        const value = rowCell[2]
                        // we keep empty rows (this allows some attacks... e.g. with high values in the db (todo add sanity checks!))
                        while (data.length <= row) { data.push(new Map()) }
                        const dataRow = data[row]
                        dataRow.set(col.toString(), value)
                    }
                    newEntityTables.push({ columns, data })
                } else {
                    console.warn(`TrfDetailView.useEffect[selected] unknown entity type: ${entity.type}`, entity)
                }
            }
            setEntityTables(newEntityTables)

            console.timeEnd(`TrfDetailView.useEffect[selected]...`)
        } catch (e) {
            console.error(`TrfDetailView.useEffect[selected] got error:${e}`)
            setEntityTables([])
        }
        return () => {
            console.log(`TrfDetailView.useEffect[selected] unmount`)
        }
    }, [selected])

    return <div className={`trfDetailView${prefersDarkMode ? ' rs-theme-dark' : ''}`}>
        {`Detail view for ${selected.srcIndex || ''}:${selected.name || selected.label} `}
        {entityTables.map((et, idx) =>
        (<div key={`div_et_${idx}`} style={{ display: 'table', padding: '6px 0px 4px 0px' }}>
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
                                    {row.get(col.key) || ''}
                                </TableCell> : <TableCell key={col.key}>{row.get(col.key) || ''}</TableCell>)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>))
        }
    </div >
}
