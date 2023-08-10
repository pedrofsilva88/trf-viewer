import { DB } from '@sqlite.org/sqlite-wasm';
import { useEffect, useMemo, useState } from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps } from '@mui/lab/TreeItem';

import './TrfListView.css'
import { TrfReportItem } from './TrfWorkbenchView';
import { TrfImage } from './TrfImage';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export interface TrfReport {
    fileName: string,
    db: DB,
    dbInfo: any,
}

interface TrfListViewProps {
    items: TrfReportItem[]
    selected: TrfReportItem | undefined
}

type TrfListItemProps = { result: string } & TreeItemProps
const TrfListItem = (props: TrfListItemProps) => (
    <TreeItem {...props} />
)

/**
 * represent a report item tree from a single database
 * @param props 
 * @returns 
 */

export const TrfListView = (props: TrfListViewProps) => {

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
    }

    // for the details list view:
    const selectedItems = useMemo(() => { return props.selected ? [props.selected] : props.items }, [props.items, props.selected])

    const [expanded, setExpanded] = useState<string[]>(() => selectedItems.map(item => item.id.toString()));
    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        setExpanded(selectedItems.map(item => item.id.toString()))
        setSelected([])// selectedItems.map(item => item.id.toString())) // or only the first?
    }, [selectedItems])

    const handleToggle = (_event: React.SyntheticEvent, nodeIds: string[]) => {
        setExpanded(nodeIds);
    };

    const handleSelect = (_event: React.SyntheticEvent, nodeIds: string[]) => {
        setSelected(nodeIds);
    };

    return <div className='trfListView'>
        <TreeView
            aria-label="reportitems"
            expanded={expanded}
            selected={selected}
            onNodeToggle={handleToggle}
            onNodeSelect={handleSelect}
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            /*defaultEndIcon={<CloseSquare />}*/
            /* we use width 100% as we dont want a horiz scrollbar but wrapped items */
            sx={{ alignItems: 'stretch', width: '100%', height: 500, flexGrow: 1 }}
        >
            {selectedItems.map(renderTrfItemList)}
        </TreeView>
    </div >
}

// todo replace by other icons
function MinusSquare(props: SvgIconProps) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
        </SvgIcon>
    );
}

function PlusSquare(props: SvgIconProps) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
        </SvgIcon>
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
