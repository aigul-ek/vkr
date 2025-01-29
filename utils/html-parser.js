const xpath = require('xpath')
const parse5 = require('parse5')
const xmlser = require('xmlserializer')
const dom = require('xmldom').DOMParser
const Buffer = require('buffer').Buffer
const iconv = require('iconv-lite')

module.exports.findFormulaAndLocation = async (html) => {
  const document = parse5.parse(html.toString())
  const xhtml = xmlser.serializeToString(document)
  const doc = new dom().parseFromString(xhtml, 'application/xhtml+xml')
  const select = xpath.useNamespaces({"x": "http://www.w3.org/1999/xhtml"})
  const imgNodes = select("//x:img[contains(@src, 'formula')]", doc)

  const formulas = []
  const blockPositions = {}

  imgNodes.forEach(imgNode => {
    const src = imgNode.getAttribute('src')
    const textMatch = src.match(/text=([^&]+)/)
    let decodedText = null
    if (textMatch) {
      const encodedText = textMatch[1]
      const decodedBase64 = Buffer.from(encodedText, 'base64')
      decodedText = iconv.decode(decodedBase64, 'win1251')
    }

    let parentNode = imgNode
    let blockId = null
    while (parentNode) {
      if (parentNode.nodeType === 1 && parentNode.getAttribute('class') && parentNode.getAttribute('class').includes('block')) {
          blockId = parentNode.getAttribute('id')
          break
      }
      parentNode = parentNode.parentNode;
    }

    if (decodedText && blockId) {
      if (!blockPositions[blockId]) {
          blockPositions[blockId] = 0
      }
      const position = blockPositions[blockId]++
      formulas.push({ text: decodedText, blockId: blockId, position: position })
    }
  })

  return formulas
}
