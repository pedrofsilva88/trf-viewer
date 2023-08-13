import { useEffect, useRef, useState } from 'react';

import { DB } from '@sqlite.org/sqlite-wasm';
import { TrfImage, TrfImageProps } from './TrfImage';
import { Container, Section, Bar } from '@column-resizer/react';
import { TrfTreeView } from './TrfTreeView';
import { TrfListView } from './TrfListView';
import { useLocalStorage } from 'usehooks-ts';
import { TrfDetailView } from './TrfDetailView';
import { TrfPkgSummaryView } from './TrfPkgSummaryView';

export interface TrfReport {
    fileName: string,
    db: DB,
    dbInfo: any,
}

export enum ItemType {
    Project,
    Package,
    TestSteps,
}

export interface TrfReportItem {
    id: number,
    itemType: ItemType, // only to identify the additionally created items for tree view
    icon?: TrfImageProps,
    srcType?: string,
    srcIndex?: string,
    name: string,
    label: string,
    duration?: number,
    timestamp?: number,
    timestampRelative?: number,
    result: string,
    origResult?: string,
    elementary_result: number,
    info?: string,
    targetValue?: string,
    comment?: string,
    children: TrfReportItem[],
}

export enum ViewType {
    None,
    PrjSummary,
    PkgSummary,
    TestSteps,
}

interface TrfWorkbenchProps {
    trf: TrfReport
}

export const TrfWorkbenchView = (props: TrfWorkbenchProps) => {
    const { trf } = props

    const [reportItemMap, setReportItemMap] = useState<Map<number, TrfReportItem>>(new Map())
    const [rootReportItems, setRootReportItems] = useState<TrfReportItem[]>([])
    const [packageItems, setPackageItems] = useState<TrfReportItem[]>([])
    const [treeSelectedNodeId, setTreeSelectedNodeId] = useState<number | undefined>(undefined)
    const [listSelectedNodeId, setListSelectedNodeId] = useState<number | undefined>(undefined)
    const [listViewType, setListViewType] = useState<ViewType>(ViewType.None)

    const [lsSection1Width, _setLSSection1Width] = useLocalStorage<number>("bench.Section1Width", 200)
    const [lsSection2Height, _setLSSection2Height] = useLocalStorage<number>("bench.Section2Height", 400)
    // need to debounce it so we store it in a ref (to avoid rerender)
    // and have a timer that checks and stores in localStorage
    const section1Width = useRef<number>(lsSection1Width)
    const section2Height = useRef<number>(lsSection2Height)

    /* seems like localStorage.setItem is fast enough...
    useEffect(() => {
        const timerId = setInterval(() => {
            //console.log(`TrfWorkbenchView timer checking section1Width=${section1Width.current}`)
            const persistedSection1Width = JSON.parse(localStorage.getItem("bench.Section1Width"))
            if (section1Width.current !== persistedSection1Width) {
                console.log(`TrfWorkbenchView storing new section1Width=${section1Width.current}`)
                localStorage.setItem("bench.Section1Width", JSON.stringify(section1Width.current))
            }
        }, 5000)

        return () => {
            clearInterval(timerId)
            console.log(`TrfWorkbenchView useEffect[section1Width] unmount`)
        }
    }, [section1Width])*/

    useEffect(() => {
        console.log(`TrfWorkbenchView useEffect[trf]...`)

        // load all report items:
        console.time(`exec query for all reportitems`)
        const columnNames: string[] = []
        const resultRows: any[] =
            trf.db.exec({ sql: `SELECT id, parent_id, src_category, src_type, src_subtype, src_index, activity, name, label, duration, timestamp, timestamp_relative, result, original_result, elementary_result, image_id, info, targetvalue, comment from reportitem join reportitem_data on reportitem_data.reportitem_id = reportitem.id left join reportitem_image on reportitem_image.key = reportitem_data.reportitem_image_key;`, returnValue: 'resultRows', rowMode: 'array', columnNames: columnNames })
        // todo check whether callback or rowMode array is faster
        console.timeEnd(`exec query for all reportitems`)
        console.log(`TrfWorkbenchView useEffect[trf]... got ${resultRows.length} resultRows`)
        console.log(`TrfWorkbenchView useEffect[trf]... got columnNames: ${columnNames}`)
        console.log(`TrfWorkbenchView useEffect[trf]... got 1st row ${resultRows[0]}`)

        const tmpReportitemMap = new Map<number, TrfReportItem>()
        const roots: TrfReportItem[] = [] // all without parent_id
        const idxIdCol = columnNames.findIndex((colName) => colName === 'id')
        const idxSrcIndexCol = columnNames.findIndex((colName) => colName === 'src_index')
        const idxSrcCategoryCol = columnNames.findIndex((colName) => colName === 'src_category')
        const idxActivityCol = columnNames.findIndex((colName) => colName === 'activity')
        const idxNameCol = columnNames.findIndex((colName) => colName === 'name')
        const idxLabelCol = columnNames.findIndex((colName) => colName === 'label')
        const idxDurationCol = columnNames.findIndex((colName) => colName === 'duration')
        const idxTimestampCol = columnNames.findIndex((colName) => colName === 'timestamp')
        const idxTimestampRelativeCol = columnNames.findIndex((colName) => colName === 'timestamp_relative')
        const idxParentIdCol = columnNames.findIndex((colName) => colName === 'parent_id')
        const idxResultCol = columnNames.findIndex((colName) => colName === 'result')
        const idxOrigResultCol = columnNames.findIndex((colName) => colName === 'original_result')
        const idxElementaryResultCol = columnNames.findIndex((colName) => colName === 'elementary_result')
        const idxSrcTypeCol = columnNames.findIndex((colName) => colName === 'src_type')
        const idxSrcSubtypeCol = columnNames.findIndex((colName) => colName === 'src_subtype')
        const idxImageIdCol = columnNames.findIndex((colName) => colName === 'image_id')
        const idxInfoCol = columnNames.findIndex((colName) => colName === 'info')
        const idxTargetValueCol = columnNames.findIndex((colName) => colName === 'targetvalue')
        const idxCommentCol = columnNames.findIndex((colName) => colName === 'comment')

        const packages: TrfReportItem[] = [] // packages/null and src_type(PACKAGE)/src_subtype(Package)

        let last_package: TrfReportItem | undefined = undefined
        for (const row of resultRows) {
            const srcIndex = row[idxSrcIndexCol] as string
            const imageId = row[idxImageIdCol] as string
            const targetValue = row[idxTargetValueCol]
            const src_category = row[idxSrcCategoryCol]
            const src_type = row[idxSrcTypeCol]
            const src_subtype = row[idxSrcSubtypeCol]

            const tvi: TrfReportItem = {
                id: row[idxIdCol],
                itemType: ItemType.TestSteps, // might be changed later below
                icon: imageId ? { db: trf.db, id: Number(imageId) } : undefined,
                srcType: src_type,
                srcIndex: srcIndex,
                name: row[idxNameCol],
                label: row[idxLabelCol] || row[idxNameCol] || row[idxActivityCol],
                duration: row[idxDurationCol],
                timestamp: row[idxTimestampCol],
                timestampRelative: row[idxTimestampRelativeCol],
                result: row[idxResultCol],
                origResult: row[idxOrigResultCol],
                elementary_result: Number(row[idxElementaryResultCol]),
                info: row[idxInfoCol],
                targetValue: targetValue ? row[idxTargetValueCol] : undefined,
                comment: row[idxCommentCol],
                children: []
            }
            tmpReportitemMap.set(tvi.id, tvi)
            const parentId = row[idxParentIdCol]
            if (!parentId) {
                tvi.itemType = ItemType.Project
                roots.push(tvi)
            } else {
                // we assume all parents are known already. (otherwise a 2nd iteration would be needed)
                const parentItem = tmpReportitemMap.get(parentId)
                if (parentItem) {
                    parentItem.children.push(tvi)
                } else {
                    console.warn(`TrfWorkbenchView useEffect[trf]... parent_id ${parentId} unknown (yet?)`)
                }
            }
            // package?
            // we assume they are sorted...
            // todo add roots properly. for now we assume there is just one!
            if (src_type === 'PACKAGE') {
                if (!src_subtype && src_category === 2) {
                    last_package = {
                        ...tvi, itemType: ItemType.Package, children: []
                    }
                    packages.push(last_package)
                } else {
                    if (last_package !== undefined) {
                        if (last_package.children.length === 0) {
                            last_package.children.push({
                                elementary_result: 0,
                                itemType: ItemType.TestSteps,
                                id: last_package.id, name: 'Test case', label: 'Test case', result: last_package.result, children: []
                            })
                        }
                        last_package.children[0].children.push(tvi) // todo or a clone without children?
                    } else {
                        console.warn(`TrfWorkbenchView useEffect[trf]... !last_package for ${tvi.id} ${src_type} ${src_subtype}`)
                    }
                }
            }
        }
        setReportItemMap(tmpReportitemMap)
        console.log(`TrfWorkbenchView useEffect[trf]... got ${roots.length} root items`)
        setRootReportItems(roots)
        console.log(`TrfWorkbenchView useEffect[trf]... got ${packages.length} package items`)
        const rootPackages = roots.length === 1 ? [{ ...roots[0], children: packages }] : packages
        setPackageItems(rootPackages)

    }, [trf, setRootReportItems, setPackageItems, setReportItemMap])

    const treeSelectedItem = treeSelectedNodeId !== undefined ? reportItemMap.get(treeSelectedNodeId) : undefined
    const listSelectedItem = listSelectedNodeId !== undefined ? reportItemMap.get(listSelectedNodeId) : undefined

    if (rootReportItems.length) {
        return <div className='trfWorkbenchView'>
            {false && [...Array(43).keys()].map(i => <TrfImage db={props.trf.db} id={1 + i} />)}
            <Container style={{ height: '600px'/*, background: '#80808080' */ }}>
                <Section minSize={100} defaultSize={section1Width.current} maxSize={400} onSizeChanged={(curSize) => {
                    section1Width.current = curSize // need to avoid re-render here so useRef...
                    localStorage.setItem("bench.Section1Width", JSON.stringify(section1Width.current))
                }}>
                    <TrfTreeView packageItems={packageItems}
                        onSelect={(viewType, nodeId) => {
                            setListViewType(viewType)
                            setTreeSelectedNodeId(nodeId)
                        }} />
                </Section>
                <Bar size={6} style={{ background: 'currentColor', cursor: 'col-resize' }} />
                <Section minSize={300} >
                    {listViewType === ViewType.TestSteps &&
                        <div style={{ height: "100%", width: "100%", display: 'grid' }}>
                            <Container vertical={true}>
                                <Section minSize={100} defaultSize={section2Height.current} onSizeChanged={(curSize) => {
                                    section2Height.current = curSize // need to avoid re-render here so useRef...
                                    localStorage.setItem("bench.Section2Height", JSON.stringify(section2Height.current))
                                }}>
                                    <TrfListView
                                        onSelect={(viewType, nodeId) => {
                                            console.log(`TrfWorkbenchView list section onSelect(${viewType}, ${nodeId})`)
                                            setListSelectedNodeId(nodeId)
                                        }}
                                        key={`listView_${rootReportItems.length}_${treeSelectedItem ? treeSelectedItem.id : 'none'}`} items={rootReportItems} selected={treeSelectedItem} trf={props.trf} />
                                </Section>
                                <Bar size={6} style={{ background: 'currentColor', cursor: 'col-resize' }} />
                                <Section minSize={50} >
                                    {listSelectedItem && <TrfDetailView items={rootReportItems} selected={listSelectedItem ? listSelectedItem : rootReportItems[0]} trf={props.trf} />}
                                </Section>
                            </Container>
                        </div>
                    }
                    {listViewType === ViewType.PkgSummary && <TrfPkgSummaryView items={rootReportItems} selected={treeSelectedItem ? treeSelectedItem : rootReportItems[0]} trf={props.trf} />}
                    {listViewType === ViewType.PrjSummary && <div>Project summary view todo!</div>}
                </Section>
            </Container>
        </div >
    } else
        return <div>{`reports ${props.trf.fileName} #${rootReportItems.length} ${JSON.stringify(props.trf.dbInfo)}`}</div>
}