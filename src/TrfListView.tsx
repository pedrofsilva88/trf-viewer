import { DB } from '@sqlite.org/sqlite-wasm';
import { DetailedHTMLProps, HTMLAttributes, useEffect, useMemo, useState } from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

import { Table } from 'rsuite';

import './TrfListView.css'
import { TrfReportItem } from './TrfWorkbenchView';
import { TrfImage } from './TrfImage';
import { useLocalStorage, useMediaQuery } from 'usehooks-ts';;

export interface TrfReport {
    fileName: string,
    db: DB,
    dbInfo: any,
}

interface TrfListViewProps {
    items: TrfReportItem[]
    selected: TrfReportItem | undefined
}

type TrfListResultCellProps = { result: string } & DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
const TrfListResultCell = (props: TrfListResultCellProps) => (
    <span {...props} />
)

/**
 * represent a report item tree from a single database
 * @param props 
 * @returns 
 */

const { Column, HeaderCell, Cell } = Table;

interface ColumnWidths {
    step: number,
    action: number,
    value: number,
    expectedValue: number,
    comment: number,
    origResult: number,
    result: number,
    timestampRelative: number,
    duration: number,
}

const ColumnWidthsDefault: ColumnWidths = {
    step: 50,
    action: 400,
    value: 150,
    expectedValue: 150,
    comment: 150,
    origResult: 75,
    result: 75,
    timestampRelative: 80,
    duration: 80,
}

export const TrfListView = (props: TrfListViewProps) => {

    /*
    const renderTrfItemList = (item: TrfReportItem) => {
        const srcIndexFrag = item.srcIndex && item.srcIndex.length ? item.srcIndex + ' - ' : ''

        return (<TrfListItem result={item.result} key={item.id} nodeId={item.id.toString()}
            label={<Box sx={{
                display: 'flex',
                alignItems: 'center',
                pr: 0,
            }}>
                {item.icon && <Box component={TrfImage} db={item.icon.db} id={item.icon.id} color="inherit" sx={{ mr: 1 }} />}
                <Typography variant="caption" color="inherit">
                    {srcIndexFrag + item.label + (item.elementary_result === 1 && item.info ? ':' + item.info : '') + (item.targetValue ? ' vs. ' + item.targetValue : '') + ' id=' + item.id.toString()}
                </Typography>
            </Box>} // {item.label + ' id=' + item.id.toString()}
        >
            {item.children.map(renderTrfItemList)}
        </TrfListItem>)
    }*/

    const [listColumnWidths, setListColumnWidths] = useLocalStorage<ColumnWidths>("listColumnWidths", ColumnWidthsDefault)
    useEffect(() => setListColumnWidths(ColumnWidthsDefault), [])


    // for the details list view:
    const selectedItems: MyRowDataType[] = useMemo(() => { return props.selected ? [props.selected] : props.items }, [props.items, props.selected])

    const [expanded, setExpanded] = useState<number[]>(() => selectedItems.map(item => item.id));

    useEffect(() => {
        setExpanded(selectedItems.map(item => item.id))
        // setSelected([])// selectedItems.map(item => item.id.toString())) // or only the first?
    }, [selectedItems])

    const onExpandChange = (isOpen: boolean, rowData: MyRowDataType) => {
        console.log(`TrfListView.onExpandChange(isOpen=${isOpen}, item.id=${rowData.id})`)
        if (isOpen) {
            setExpanded(expanded => [...expanded, rowData.id]);
        } else {
            setExpanded(expanded => { let newExp = [...expanded]; newExp.splice(newExp.findIndex(i => i === rowData.id), 1); return newExp })
        }

    };

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    // Table with
    // step, Action/name, value, expected value, remark, orig result, result, test time, time abs.

    // todo investigate how to properly define/extend the RowDataType<never>...
    // to get rid of the ts-ignore below
    interface MyRowDataType {
        dataKey?: string;
        children?: TrfReportItem[];
        [key: string]: any;
    }

    return <div className={`trfListView ${prefersDarkMode ? 'rs-theme-dark' : ''}`}>
        <Table
            isTree
            defaultExpandAllRows={false}
            bordered
            cellBordered
            rowKey="id"
            rowHeight={24}
            fillHeight
            // @ts-ignore
            data={selectedItems}
            expandedRowKeys={expanded}
            /** shouldUpdateScroll: whether to update the scroll bar after data update **/
            shouldUpdateScroll={false}
            onExpandChange={onExpandChange}
            renderTreeToggle={(_icon, rowData) => {
                if (!rowData || (rowData.children && rowData.children.length === 0)) {
                    return <div style={{ width: 15 }} />; // <SpinnerIcon spin />;
                }
                return expanded.includes(rowData.id) ? <MinusSquare /> : <PlusSquare />;
            }}
        >
            <Column width={listColumnWidths.step || ColumnWidthsDefault.step} resizable
                onResize={(columnWidth) => { if (columnWidth) { setListColumnWidths((oldWidths) => { return { ...oldWidths, step: columnWidth } }) } }}>
                <HeaderCell>#</HeaderCell>
                <Cell style={{ padding: 2 }}>
                    {(rowData) => { return (<TrfListResultCell result={rowData.result}>{rowData.srcIndex}</TrfListResultCell>) }}
                </Cell>
            </Column>
            <Column width={listColumnWidths.action || ColumnWidthsDefault.action} treeCol resizable verticalAlign='top'
                onResize={(columnWidth) => { if (columnWidth) { setListColumnWidths((oldWidths) => { return { ...oldWidths, action: columnWidth } }) } }}>
                <HeaderCell>Action/name</HeaderCell>
                <Cell style={{ padding: 2 }}>
                    {(rowData) => {
                        return (<>
                            {rowData.icon && <div style={{ display: 'inline', position: 'relative', top: +3 }}><TrfImage db={rowData.icon.db} id={rowData.icon.id} /></div>}
                            {rowData.label}
                        </>)
                    }}
                </Cell>
            </Column>
            <Column width={listColumnWidths.value || ColumnWidthsDefault.value} resizable colSpan={3}
                onResize={(columnWidth) => { if (columnWidth) { setListColumnWidths((oldWidths) => { return { ...oldWidths, value: columnWidth } }) } }}>
                <HeaderCell>value</HeaderCell>
                <Cell style={{ padding: 2 }}>
                    {(rowData) => { return (<span>{rowData.elementary_result === 1 ? rowData.info : ''}</span>) }}
                </Cell>
            </Column>
            <Column width={listColumnWidths.expectedValue || ColumnWidthsDefault.expectedValue} resizable
                onResize={(columnWidth) => { if (columnWidth) { setListColumnWidths((oldWidths) => { return { ...oldWidths, expectedValue: columnWidth } }) } }}>
                <HeaderCell>expected value</HeaderCell>
                <Cell style={{ padding: 2 }} dataKey="targetValue" />
            </Column>
            <Column width={listColumnWidths.comment || ColumnWidthsDefault.comment} resizable
                onResize={(columnWidth) => { if (columnWidth) { setListColumnWidths((oldWidths) => { return { ...oldWidths, comment: columnWidth } }) } }}>
                <HeaderCell>comment</HeaderCell>
                <Cell style={{ padding: 2 }} dataKey="comment" />
            </Column>
            <Column width={listColumnWidths.origResult || ColumnWidthsDefault.origResult} resizable
                onResize={(columnWidth) => { if (columnWidth) { setListColumnWidths((oldWidths) => { return { ...oldWidths, origResult: columnWidth } }) } }}>
                <HeaderCell>orig. result</HeaderCell>
                <Cell style={{ padding: 2 }}>
                    {(rowData) => { return (<TrfListResultCell result={rowData.origResult}>{rowData.origResult}</TrfListResultCell>) }}
                </Cell>
            </Column>
            <Column width={listColumnWidths.result || ColumnWidthsDefault.result} resizable
                onResize={(columnWidth) => { if (columnWidth) { setListColumnWidths((oldWidths) => { return { ...oldWidths, result: columnWidth } }) } }}>
                <HeaderCell>result</HeaderCell>
                <Cell style={{ padding: 2 }}>
                    {(rowData) => { return (<TrfListResultCell result={rowData.result}>{rowData.result}</TrfListResultCell>) }}
                </Cell>
            </Column>
            <Column width={listColumnWidths.timestampRelative || ColumnWidthsDefault.timestampRelative} resizable align='right'
                onResize={(columnWidth) => { if (columnWidth) { setListColumnWidths((oldWidths) => { return { ...oldWidths, timestampRelative: columnWidth } }) } }}>
                <HeaderCell>{`timestamp rel[s]`}</HeaderCell>
                <Cell style={{ padding: 2 }}>
                    {(rowData) => { return rowData.timestampRelative?.toFixed(3) ?? '' }}
                </Cell>
            </Column>

            <Column width={listColumnWidths.duration || ColumnWidthsDefault.duration} resizable align='right'
                onResize={(columnWidth) => { if (columnWidth) { setListColumnWidths((oldWidths) => { return { ...oldWidths, duration: columnWidth } }) } }}>
                <HeaderCell>{`duration[s]`}</HeaderCell>
                <Cell style={{ padding: 2 }}>
                    {(rowData) => { return rowData.duration?.toFixed(3) ?? '' }}
                </Cell>
            </Column>

        </Table>
    </div >
}

// todo replace by other icons
function MinusSquare(props: SvgIconProps) {
    return (<div style={{ position: 'relative', top: +2 }}>
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
        </SvgIcon></div>
    );
}

function PlusSquare(props: SvgIconProps) {
    return (<div style={{ position: 'relative', top: +2 }}>
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
        </SvgIcon></div>
    );
}

// function CloseSquare(props: SvgIconProps) {
//     return (
//         <SvgIcon
//             className="close"
//             fontSize="inherit"
//             style={{ width: 14, height: 14 }}
//             {...props}
//         >
//             {/* tslint:disable-next-line: max-line-length */}
//             <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
//         </SvgIcon>
//     );
// }
