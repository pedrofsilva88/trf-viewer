import { DB } from '@sqlite.org/sqlite-wasm';
import { useEffect, useState } from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps } from '@mui/lab/TreeItem';

import { Container, Section, Bar } from '@column-resizer/react';

import './TrfTreeView.css'
import { TrfImage, TrfImageProps } from './TrfImage';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export interface TrfReport {
    fileName: string,
    db: DB,
    dbInfo: any,
}

interface AtxTCsListProps {
    trf: TrfReport
}

interface TrfTreeItem {
    id: number,
    icon?: TrfImageProps,
    srcIndex?: string,
    name: string,
    label: string,
    result: string,
    children: TrfTreeItem[],
}

type TrfTreeItemProps = { result: string } & TreeItemProps
const TrfTreeItem = (props: TrfTreeItemProps) => (
    <TreeItem {...props} />
)

/**
 * represent a report item tree from a single database
 * @param props 
 * @returns 
 */

export const TrfTreeView = (props: AtxTCsListProps) => {
    const { trf } = props

    const [reportItemMap, setReportItemMap] = useState<Map<number, TrfTreeItem>>(new Map())
    const [rootReportItems, setRootReportItems] = useState<TrfTreeItem[]>([])
    const [packageItems, setPackageItems] = useState<TrfTreeItem[]>([])
    const [treeSelectedNodeId, setTreeSelectedNodeId] = useState<number | undefined>(undefined)

    useEffect(() => {
        console.log(`TrfTreeView useEffect[trf]...`)

        // load all report items:
        console.time(`exec query for all reportitems`)
        const columnNames: string[] = []
        const resultRows: any[] =
            trf.db.exec({ sql: `SELECT id, parent_id, src_category, src_type, src_subtype, src_index, activity, name, label, result, image_id from reportitem join reportitem_data on reportitem_data.reportitem_id = reportitem.id left join reportitem_image on reportitem_image.key = reportitem_data.reportitem_image_key;`, returnValue: 'resultRows', rowMode: 'array', columnNames: columnNames })
        // todo check whether callback or rowMode array is faster
        console.timeEnd(`exec query for all reportitems`)
        console.log(`TrfTreeView useEffect[trf]... got ${resultRows.length} resultRows`)
        console.log(`TrfTreeView useEffect[trf]... got columnNames: ${columnNames}`)
        console.log(`TrfTreeView useEffect[trf]... got 1st row ${resultRows[0]}`)

        const tmpReportitemMap = new Map<number, TrfTreeItem>()
        const roots: TrfTreeItem[] = [] // all without parent_id
        const idxIdCol = columnNames.findIndex((colName) => colName === 'id')
        const idxSrcIndexCol = columnNames.findIndex((colName) => colName === 'src_index')
        const idxSrcCategoryCol = columnNames.findIndex((colName) => colName === 'src_category')
        const idxActivityCol = columnNames.findIndex((colName) => colName === 'activity')
        const idxNameCol = columnNames.findIndex((colName) => colName === 'name')
        const idxLabelCol = columnNames.findIndex((colName) => colName === 'label')
        const idxParentIdCol = columnNames.findIndex((colName) => colName === 'parent_id')
        const idxResultCol = columnNames.findIndex((colName) => colName === 'result')
        const idxSrcTypeCol = columnNames.findIndex((colName) => colName === 'src_type')
        const idxSrcSubtypeCol = columnNames.findIndex((colName) => colName === 'src_subtype')
        const idxImageIdCol = columnNames.findIndex((colName) => colName === 'image_id')

        const packages: TrfTreeItem[] = [] // packages/null and src_type(PACKAGE)/src_subtype(Package)

        let last_package: TrfTreeItem | undefined = undefined
        for (const row of resultRows) {
            const srcIndex = row[idxSrcIndexCol] as string
            const imageId = row[idxImageIdCol] as string

            const tvi: TrfTreeItem = {
                id: row[idxIdCol],
                icon: imageId ? { db: trf.db, id: Number(imageId) } : undefined,
                srcIndex: srcIndex,
                name: row[idxNameCol],
                label: row[idxLabelCol] || row[idxNameCol] || row[idxActivityCol],
                result: row[idxResultCol],
                children: []
            }
            tmpReportitemMap.set(tvi.id, tvi)
            const parentId = row[idxParentIdCol]
            if (!parentId) {
                roots.push(tvi)
            } else {
                // we assume all parents are known already. (otherwise a 2nd iteration would be needed)
                const parentItem = tmpReportitemMap.get(parentId)
                if (parentItem) {
                    parentItem.children.push(tvi)
                } else {
                    console.warn(`TrfTreeView useEffect[trf]... parent_id ${parentId} unknown (yet?)`)
                }
            }
            // package?
            const src_category = row[idxSrcCategoryCol]
            const src_type = row[idxSrcTypeCol]
            const src_subtype = row[idxSrcSubtypeCol]
            if (src_type === 'PACKAGE') {
                if (!src_subtype && src_category === 2) {
                    last_package = {
                        id: tvi.id, name: tvi.name, label: tvi.label, result: tvi.result, children: []
                    }
                    packages.push(last_package)
                } else {
                    if (last_package !== undefined) {
                        if (last_package.children.length === 0) {
                            last_package.children.push({
                                id: -last_package.id, name: 'Testfall', label: 'Testfall', result: last_package.result, children: []
                            })
                        }
                        last_package.children[0].children.push(tvi) // todo or a clone without children?
                    } else {
                        console.warn(`TrfTreeView useEffect[trf]... !last_package for ${tvi.id} ${src_type} ${src_subtype}`)
                    }
                }
            }
        }
        setReportItemMap(tmpReportitemMap)
        console.log(`TrfTreeView useEffect[trf]... got ${roots.length} root items`)
        setRootReportItems(roots)
        console.log(`TrfTreeView useEffect[trf]... got ${packages.length} package items`)
        setPackageItems(packages)

    }, [trf, setRootReportItems, setPackageItems, setReportItemMap])

    const renderTrfTreeItem = (item: TrfTreeItem) => {
        const srcIndexFrag = item.srcIndex && item.srcIndex.length ? item.srcIndex + ' - ' : ''

        return (<TrfTreeItem result={item.result} key={item.id} nodeId={item.id.toString()}
            label={<Box sx={{
                display: 'flex',
                alignItems: 'center',
                pr: 0,
            }}>
                {item.icon && <Box component={TrfImage} db={item.icon.db} id={item.icon.id} color="inherit" sx={{ mr: 1 }} />}
                <Typography variant="caption" color="inherit">
                    {srcIndexFrag + (item.name || item.label) + ' id=' + item.id.toString()}
                </Typography>
            </Box>} // {item.label + ' id=' + item.id.toString()}
        >
            {item.children.map(renderTrfTreeItem)}
        </TrfTreeItem>)
    }

    const renderTrfItemList = (item: TrfTreeItem) => {
        const srcIndexFrag = item.srcIndex && item.srcIndex.length ? item.srcIndex + ' - ' : ''

        return (<TrfTreeItem result={item.result} key={item.id} nodeId={item.id.toString()}
            label={<Box sx={{
                display: 'flex',
                alignItems: 'center',
                pr: 0,
            }}>
                {item.icon && <Box component={TrfImage} db={item.icon.db} id={item.icon.id} color="inherit" sx={{ mr: 1 }} />}
                <Typography variant="caption" color="inherit">
                    {srcIndexFrag + item.label + ' id=' + item.id.toString()}
                </Typography>
            </Box>} // {item.label + ' id=' + item.id.toString()}
        >
            {item.children.map(renderTrfItemList)}
        </TrfTreeItem>)
    }

    // for the details tree view:
    const [expanded, setExpanded] = useState<string[]>([]);
    const [selected, setSelected] = useState<string[]>([]);

    const selectedItem = treeSelectedNodeId !== undefined ? reportItemMap.get(treeSelectedNodeId) : undefined
    const selectedItems = selectedItem ? [selectedItem] : rootReportItems

    useEffect(() => {
        setExpanded(selectedItems.map(item => item.id.toString()))
        setSelected([])// selectedItems.map(item => item.id.toString())) // or only the first?
    }, [rootReportItems, treeSelectedNodeId])

    const handleToggle = (_event: React.SyntheticEvent, nodeIds: string[]) => {
        setExpanded(nodeIds);
    };

    const handleSelect = (_event: React.SyntheticEvent, nodeIds: string[]) => {
        setSelected(nodeIds);
    };

    if (rootReportItems.length) {

        return <div className='trfTreeView'>
            {false && [...Array(43).keys()].map(i => <TrfImage db={props.trf.db} id={1 + i} />)}
            <Container style={{ height: '500px', background: '#80808080' }}>
                <Section minSize={100} defaultSize={200} maxSize={400}>
                    <div style={{ overflow: 'scroll', display: 'flex', height: '100%', width: '100%' }}>
                    <TreeView
                        aria-label="packages"
                        defaultExpanded={['1']}
                        defaultCollapseIcon={<MinusSquare />}
                        defaultExpandIcon={<PlusSquare />}
                        defaultEndIcon={<div style={{ width: 25 }} />}
                            sx={{ alignItems: 'stretch',/* minHeight: 500, */flexGrow: 1, minWidth: 'max-content' }}
                        onNodeSelect={(_event: React.SyntheticEvent, nodeIds: string[] | string) => {
                            console.log(`TrfTreeView tree onNodeSelect(${nodeIds})`)
                            const id: number | undefined = Array.isArray(nodeIds) ?
                                (nodeIds.length > 0 ? Number(nodeIds[0]) : undefined)
                                : Number(nodeIds)
                            if (id !== undefined) {
                                setTreeSelectedNodeId(id < 0 ? -id : id)
                            } else {
                                setTreeSelectedNodeId(undefined)
                            }
                        }}
                    >
                        {packageItems.map(renderTrfTreeItem)}
                    </TreeView>
                    </div>
                </Section>
                <Bar size={6} style={{ background: 'currentColor', cursor: 'col-resize' }} />
                <Section minSize={300} >
                    <TreeView
                        aria-label="reportitems"
                        expanded={expanded}
                        selected={selected}
                        onNodeToggle={handleToggle}
                        onNodeSelect={handleSelect}
                        defaultCollapseIcon={<MinusSquare />}
                        defaultExpandIcon={<PlusSquare />}
                        /*defaultEndIcon={<CloseSquare />}*/
                        sx={{ height: 500, flexGrow: 1, maxWidth: 800, overflowY: 'auto' }}
                    >
                        {selectedItems.map(renderTrfItemList)}
                    </TreeView>
                </Section>
            </Container>
        </div >
    } else
        return <div>{`reports ${props.trf.fileName} #${rootReportItems.length} ${JSON.stringify(props.trf.dbInfo)}`}</div>
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
