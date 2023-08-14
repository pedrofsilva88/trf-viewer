/**
 * todos:
 * [] support type "textentity" (e.g.for 2.40.22)
 * [] add first table with repetition of the list entry
 */

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
import { TableEntity, getTableEntityCellTable } from './utils';

interface TrfDetailViewProps {
    trf: TrfReport,
    items: TrfReportItem[],
    selected: TrfReportItem
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
                    const table = getTableEntityCellTable(trf.db, entity.id, entity.name)
                    newEntityTables.push(table)
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
