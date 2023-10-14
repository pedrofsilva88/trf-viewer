import { XMLParser } from 'fast-xml-parser'

export interface FileMapping {
  fileName: string // e.g. foo.pcapng
  relPath: string // e.g. '000_testcase1'
  mappedToPath: string // e.g. 'fdb5.../foo.pcapng' <- fileName is added and \ replaced by /

  combinedFilePath: string // e.g. 000_testcase1/foo.pcapng (with \ replaced by / )
}

const parser = new XMLParser({ preserveOrder: true })

/**
 * parse an ATX mapping.xml file
 * @param fileText text from mapping.xml file
 * @returns Array of FileMapping entries
 */
export const parseMappingXml = (fileText: string): FileMapping[] => {
  const fileMappings: FileMapping[] = []
  try {
    const xml = parser.parse(fileText)
    if (xml && Array.isArray(xml)) {
      for (const o of xml) {
        // we expect objects with one key:
        if (typeof o === 'object' && Object.keys(o).includes('FILES')) {
          const filesO = o.FILES
          if (Array.isArray(filesO)) {
            for (const fileO of filesO) {
              if (typeof fileO === 'object' && Object.keys(fileO).includes('FILE')) {
                const fileAttrArr = fileO.FILE
                if (Array.isArray(fileAttrArr)) {
                  let fileName: string | undefined
                  let relPath: string | undefined
                  let mappedToPath: string | undefined
                  for (const fileAttr of fileAttrArr) {
                    for (const [key, val] of Object.entries(fileAttr)) {
                      switch (key) {
                        case 'FILENAME':
                          fileName = getInnerText(val as JSONValue)
                          break
                        case 'REL-PATH':
                          relPath = getInnerText(val as JSONValue)
                          break
                        case 'TEMP-DIR':
                          mappedToPath = getInnerText(val as JSONValue)
                          break
                      }
                    }
                    if (mappedToPath && fileName) {
                      mappedToPath = mappedToPath.replace('\\', '/') + '/' + fileName
                      const combinedFilePath = relPath && relPath.length ? relPath.replace('\\', '/') + '/' + fileName : fileName

                      fileMappings.push({ fileName, mappedToPath, relPath: relPath || '', combinedFilePath })
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      console.warn(`parseMappingXml got malformed xml (no array)`, xml)
    }
  } catch (e) {
    console.error(`parseMappingXml got e=${e}`)
  }
  return fileMappings
}

type JSONValue = string | number | boolean | JSONObject | Array<JSONValue>
type JSONObject = { [x: string]: JSONValue }

const getInnerText = (val: JSONValue): string | undefined => {
  if (Array.isArray(val)) {
    if (val.length === 1 && typeof val[0] === 'object' && '#text' in val[0]) {
      const t = val[0]['#text']
      if (typeof t === 'string') {
        return t
      } else if (typeof t === 'number') {
        return t.toString()
      }
    } else if (val.length === 0) {
      return undefined // normal, no inner text
    }
  }
  console.warn(`getInnerText wrong type`, val)
  return undefined
}
