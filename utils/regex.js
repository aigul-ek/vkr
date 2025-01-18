const Buffer = require('buffer').Buffer
const iconv = require('iconv-lite')
const { v4: uuidv4 } = require('uuid')

module.exports.extractAndReplaceFormulaString = (string) => {
    const regex = /<img\s+[^>]*src="\/document\/formula\?revision=\d+&text=([^&]+)&fmt=png"[^>]*>/g
    let match
    const formulas = {}
    let modifiedString = string

    while ((match = regex.exec(string)) !== null) {
        const decodedBase64 = Buffer.from(match[1], 'base64')
        const decodedText = iconv.decode(decodedBase64, 'win1251')
        const guid = uuidv4()
        formulas[guid] = decodedText
        modifiedString = modifiedString.replace(match[0], guid)
    }

    return { modifiedString, formulas }
}
