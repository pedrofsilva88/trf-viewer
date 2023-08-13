import { DetailedHTMLProps, HTMLAttributes, useEffect, useMemo } from 'react'
import { Table } from 'rsuite'

import './TrfPrjListView.css'
import { TrfReport, TrfReportItem, ViewType } from './TrfWorkbenchView'
import { TrfImage } from './TrfImage'
import { useLocalStorage, useMediaQuery } from 'usehooks-ts'

interface TrfPrjListReportItem extends TrfReportItem {
    idx: number,
}

interface TrfPrjListViewProps {
    trf: TrfReport,
    items: TrfPrjListReportItem[]
    onSelect: (viewType: ViewType, nodeId?: number, node?: TrfPrjListReportItem) => void
}

type TrfListResultCellProps = { result: string } & DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
const TrfListResultCell = (props: TrfListResultCellProps) => (
    <span {...props} />
)

const { Column, HeaderCell, Cell } = Table;

interface ColumnWidths {
    step: number,
    action: number,
    name: number,
    value: number,
    comment: number,
    origResult: number,
    result: number,
    timestampRelative: number,
    duration: number,
    timestampAbs: number,
}

const ColumnWidthsDefault: ColumnWidths = {
    step: 50,
    action: 300,
    name: 150,
    value: 200,
    comment: 150,
    origResult: 75,
    result: 75,
    timestampRelative: 80,
    duration: 80,
    timestampAbs: 150,
}

const dateTimeOptions: Intl.DateTimeFormatOptions = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
}

export const TrfPrjListView = (props: TrfPrjListViewProps) => {

    // const dateTimeFormat = new Intl.DateTimeFormat("de-DE", dateTimeOptions)
    const dateTimeFormat = useMemo(() => {
        // const timezone = (props.trf.dbInfo.timezone || 7200) // / 60 // 7200 = +2h / 60 = 120mins
        //console.log(`TrfPrjListView useMemo[dbInfo] timezone(sec diff)=${timezone}`)
        // we could show another column in the time of that timezone by checking the
        // local offset at test start time and then modifying by the delta
        return new Intl.DateTimeFormat(undefined, { ...dateTimeOptions })
    }, [props.trf.dbInfo])

    const [listColumnWidths, setListColumnWidths] = useLocalStorage<ColumnWidths>("PrjListColumnWidths", ColumnWidthsDefault)
    useEffect(() => setListColumnWidths(ColumnWidthsDefault), [])
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    // Table with
    // step, Action/name, value, expected value, remark, orig result, result, test time, time abs.

    // todo investigate how to properly define/extend the RowDataType<never>...
    // to get rid of the ts-ignore below
    /*
    interface MyRowDataType {
        dataKey?: string;
        children?: TrfPrjListReportItem[];
        [key: string]: any;
    }*/

    return <div className={`trfPrjListView ${prefersDarkMode ? 'rs-theme-dark' : ''}`}>
        <Table
            isTree={false}
            defaultExpandAllRows={false}
            bordered
            cellBordered
            rowKey="id"
            rowHeight={24}
            fillHeight
            // @ts-ignore
            data={props.items}
            /** shouldUpdateScroll: whether to update the scroll bar after data update **/
            shouldUpdateScroll={false}
            onRowClick={(node) => {
                props.onSelect(ViewType.TestSteps, node.id, node as unknown as TrfPrjListReportItem) // todo viewType is wrong!
            }}
        >
            <Column width={listColumnWidths.step || ColumnWidthsDefault.step} resizable align='right'
                onResize={(columnWidth) => { if (columnWidth) { setListColumnWidths((oldWidths) => { return { ...oldWidths, step: columnWidth } }) } }}>
                <HeaderCell>#</HeaderCell>
                <Cell dataKey="idx" />
            </Column>
            <Column width={listColumnWidths.result || ColumnWidthsDefault.result} resizable
                onResize={(columnWidth) => { if (columnWidth) { setListColumnWidths((oldWidths) => { return { ...oldWidths, result: columnWidth } }) } }}>
                <HeaderCell>result</HeaderCell>
                <Cell >
                    {(rowData) => { return (<TrfListResultCell result={rowData.result}>{rowData.result}</TrfListResultCell>) }}
                </Cell>
            </Column>
            <Column width={listColumnWidths.timestampAbs || ColumnWidthsDefault.timestampAbs} resizable align='left'
                onResize={(columnWidth) => { if (columnWidth) { setListColumnWidths((oldWidths) => { return { ...oldWidths, timestampAbs: columnWidth } }) } }}>
                <HeaderCell>{`time`}</HeaderCell>
                <Cell >
                    {(rowData) => { return rowData.timestamp ? (dateTimeFormat.format(new Date(1000 * rowData.timestamp))) : '' }}
                </Cell>
            </Column>
            <Column width={listColumnWidths.action || ColumnWidthsDefault.action} treeCol resizable verticalAlign='top'
                onResize={(columnWidth) => { if (columnWidth) { setListColumnWidths((oldWidths) => { return { ...oldWidths, action: columnWidth } }) } }}>
                <HeaderCell>activity</HeaderCell>
                <Cell>
                    {(rowData) => {
                        return (<>
                            {rowData.icon && <div style={{ display: 'inline', position: 'relative', top: +3 }}><TrfImage db={rowData.icon.db} id={rowData.icon.id} /></div>}
                            {rowData.activity}
                        </>)
                    }}
                </Cell>
            </Column>
            <Column width={listColumnWidths.name || ColumnWidthsDefault.name} treeCol resizable verticalAlign='top'
                onResize={(columnWidth) => { if (columnWidth) { setListColumnWidths((oldWidths) => { return { ...oldWidths, name: columnWidth } }) } }}>
                <HeaderCell>name</HeaderCell>
                <Cell>
                    {(rowData) => {
                        return (<>
                            {rowData.name}
                        </>)
                    }}
                </Cell>
            </Column>

            <Column width={listColumnWidths.value || ColumnWidthsDefault.value} resizable colSpan={3}
                onResize={(columnWidth) => { if (columnWidth) { setListColumnWidths((oldWidths) => { return { ...oldWidths, value: columnWidth } }) } }}>
                <HeaderCell>info</HeaderCell>
                <Cell dataKey='info' />
            </Column>
            <Column width={listColumnWidths.comment || ColumnWidthsDefault.comment} resizable
                onResize={(columnWidth) => { if (columnWidth) { setListColumnWidths((oldWidths) => { return { ...oldWidths, comment: columnWidth } }) } }}>
                <HeaderCell>comment</HeaderCell>
                <Cell dataKey="comment" />
            </Column>

        </Table>
    </div >
}
