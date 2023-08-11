
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import TreeView from '@mui/lab/TreeView'
import TreeItem, { TreeItemProps } from '@mui/lab/TreeItem'

import './TrfTreeView.css'
import { TrfImage } from './TrfImage'
import { ItemType, TrfReportItem, ViewType } from './TrfWorkbenchView'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useMemo } from 'react'


interface TrfTreeViewProps {
    packageItems: TrfReportItem[]
    onSelect: (viewType: ViewType, nodeId?: number) => void
}

type TrfTreeItemProps = { result: string } & TreeItemProps
const TrfTreeItem = (props: TrfTreeItemProps) => (
    <TreeItem {...props} />
)

/// we encode itemType and id in the nodeId to be able to handle onSelect differently
const idForItem = (item: TrfReportItem) => {
    switch (item.itemType) {
        case ItemType.Project: return 'Prj_' + item.id.toString()
        case ItemType.Package: return 'Pkg_' + item.id.toString()
    }
    return item.id.toString()
}

const nodeIdToTypeAndId = (nodeId: string): [ItemType, number] => {
    if (nodeId.startsWith('Prj_')) {
        return [ItemType.Project, Number(nodeId.slice(4,))]
    } else if (nodeId.startsWith('Pkg_')) {
        return [ItemType.Package, Number(nodeId.slice(4,))]
    } else {
        return [ItemType.TestSteps, Number(nodeId)]
    }
}
/**
 * represent a report item tree from a single database
 * @param props 
 * @returns 
 */

export const TrfTreeView = (props: TrfTreeViewProps) => {
    const { packageItems } = props

    const renderTrfTreeItem = (item: TrfReportItem) => {
        const srcIndexFrag = item.srcIndex && item.srcIndex.length ? item.srcIndex + ' - ' : ''
        const nodeId = idForItem(item)

        return (<TrfTreeItem result={item.result} key={nodeId} nodeId={nodeId}
            label={<Box sx={{
                display: 'flex',
                alignItems: 'center',
                pr: 0,
            }}>
                {item.icon && <Box component={TrfImage} db={item.icon.db} id={item.icon.id} color="inherit" sx={{ mr: 1 }} />}
                <Typography variant="caption" color="inherit">
                    {srcIndexFrag + (item.name || item.label) /* + ' id=' + nodeId*/}
                </Typography>
            </Box>} // {item.label + ' id=' + item.id.toString()}
        >
            {item.children.map(renderTrfTreeItem)}
        </TrfTreeItem>)
    }

    const defaultExpanded = useMemo(() => [idForItem(packageItems[0])], [packageItems])

    return <div className='trfTreeView'>
        <TreeView
            aria-label="packages"
            defaultExpanded={defaultExpanded} 
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultEndIcon={<div style={{ width: 25 }} />}
            sx={{ alignItems: 'stretch',/* minHeight: 500, */flexGrow: 1, minWidth: 'max-content' }}
            onNodeSelect={(_event: React.SyntheticEvent, nodeIds: string[] | string) => {
                console.log(`TrfTreeView tree onNodeSelect(${nodeIds})`)
                const nodeId: string | undefined = Array.isArray(nodeIds) ?
                    (nodeIds.length > 0 ? nodeIds[0] : undefined)
                    : nodeIds
                if (nodeId !== undefined) {
                    const [itemType, id] = nodeIdToTypeAndId(nodeId)
                    if (itemType === ItemType.Project || itemType === ItemType.Package) {
                        props.onSelect(ViewType.Summary, id)
                    } else {
                        props.onSelect(ViewType.TestSteps, id)
                    }
                } else {
                    props.onSelect(ViewType.None)
                }
            }}
        >
            {packageItems.map(renderTrfTreeItem)}
        </TreeView>
    </div>
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
