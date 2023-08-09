import { DB } from "@sqlite.org/sqlite-wasm"
import { useEffect, useRef, useState } from "react"

export interface TrfImageProps {
    db: DB,
    id: number /// from table "image"
}

const globalPreRenderedCanvasCache: Map<DB, Map<number, HTMLCanvasElement | undefined>> = new Map()

const getPreRenderedCanvas = (imageProps: TrfImageProps) => {
    let idMap = globalPreRenderedCanvasCache.get(imageProps.db)
    if (!idMap) {
        idMap = new Map()
        globalPreRenderedCanvasCache.set(imageProps.db, idMap)
    }

    let canvas = idMap.get(imageProps.id)
    if (!canvas) {
        //console.log(`getPreRenderedCanvas(id=${imageProps.id}) memo[props.db,props.id]...`)
        const resultRows: any[] = imageProps.db.exec({ sql: `SELECT width, height, mask_color, data from image where id=${imageProps.id}`, returnValue: 'resultRows', rowMode: 'object' })

        if (resultRows.length > 0) {
            const imageInfo = resultRows[0]
            if (imageInfo.width > 0 && imageInfo.height > 0 && imageInfo.data.length === (3 * imageInfo.height * imageInfo.width)) {
                const width = imageInfo.width
                const height = imageInfo.height
                // todo use https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays ?

                const srcData: Uint8Array = imageInfo.data
                const srcMaskColor: string = imageInfo.mask_color
                const [mR, mG, mB] = srcMaskColor.startsWith('#') ? [Number.parseInt(srcMaskColor.slice(1, 3), 16), Number.parseInt(srcMaskColor.slice(3, 5), 16), Number.parseInt(srcMaskColor.slice(5, 7), 16)] : [255, 255, 255]
                canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')
                if (ctx) {
                    const imageData = ctx.createImageData(width, height)
                    const data = imageData.data // RGBA format, 1 byte each
                    let dataOffset = 0
                    let srcOffset = 0
                    for (let ix = 0; ix < width; ++ix) {
                        for (let iy = 0; iy < height; ++iy) {
                            const srcR = srcData[srcOffset]
                            const srcG = srcData[srcOffset + 1]
                            const srcB = srcData[srcOffset + 2]
                            data[dataOffset + 0] = srcR
                            data[dataOffset + 1] = srcG
                            data[dataOffset + 2] = srcB
                            data[dataOffset + 3] = (srcR === mR && srcG === mG && srcB === mB) ? 0 : 255 // alpha
                            dataOffset += 4
                            srcOffset += 3
                        }
                    }
                    ctx.putImageData(imageData, 0, 0);
                } else {
                    canvas = undefined
                }
            }
        }
        idMap.set(imageProps.id, canvas)
    }
    return canvas
}

export const TrfImage = (props: TrfImageProps) => {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [width, setWidth] = useState(16)
    const [height, setHeight] = useState(16)

    useEffect(() => {
        //console.log(`TrfImage(id=${props.id}) effect[] dpr=${window.devicePixelRatio}`)
        const canvas = canvasRef.current
        if (canvas) {
            try {
                const ctx = canvas.getContext('2d')
                if (ctx) {
                    const imgCanvas = getPreRenderedCanvas(props)
                    if (imgCanvas) {
                        setWidth(imgCanvas.width)
                        setHeight(imgCanvas.height)
                        ctx.drawImage(imgCanvas, 0, 0);
                    } else {
                        console.error(`TrfImage(id=${props.id}) effect[] no imgCanvas!`)
                    }
                }
            } catch (e) {
                console.error(`TrfImage(id=${props.id}) effect[] got error:${e}`)
            }
        }
    }, [canvasRef, props.db, props.id, width, height]) // we simply re-render if width/heigth changed

    return <canvas ref={canvasRef} width={width} height={height} />
}