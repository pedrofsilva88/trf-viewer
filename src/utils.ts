import { DB } from "@sqlite.org/sqlite-wasm"

interface TableColumn {
    key: string,
    label?: string
}

export interface TableEntity {
    name?: string,
    columns: TableColumn[],
    data: Record<string, string>[]
}

export const getTableEntityCellTable = (db: DB, entityId: number, name?: string): TableEntity => {
    const resultRows: any[] =
        db.exec({ sql: `SELECT row, col, value from tableentity_cell where entity_id=${entityId};`, returnValue: 'resultRows', rowMode: 'array' })
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
    const data: Record<string, string>[] = []
    for (const rowCell of resultRows) {
        if (rowCell[0] <= 0) { continue }
        const row = rowCell[0] - 1
        const col = rowCell[1]
        const value = rowCell[2]
        // we keep empty rows (this allows some attacks... e.g. with high values in the db (todo add sanity checks!))
        while (data.length <= row) { data.push({}) }
        const dataRow = data[row]
        dataRow[col.toString()] = value
    }
    return { name, columns, data }
}

/**
 * Output a duration in h:mm:ss[.mmm] format
 * @param durationSecs in seconds
 * @param outputMs output ms with 3 digits as well?
 * @returns string
 */
export const timeFormat = (durationSecs: number, outputMs: boolean) => {
    //const days = Math.floor(distance / (3600 * 24))
    //distance -= days * (3600 * 24)
    const hours = Math.floor(durationSecs / 3600)
    durationSecs -= hours * 3600
    const minutes = Math.floor(durationSecs / 60)
    durationSecs -= minutes * 60
    const seconds = Math.floor(durationSecs)
    durationSecs -= seconds
    const ms = durationSecs
    if (outputMs) {
        return `${hours}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}.${ms.toFixed(3).slice(2)}`;
    } else {
        return `${hours}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`
    }
}