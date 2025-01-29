const { search, getHtml } = require('./utils/garant-fixture')
const { startMongoose } = require('./utils/mongoose')
const { compareDocuments } = require('./utils/compare')
const { findFormulaAndLocation } = require('./utils/html-parser')
const { notifyResults } = require('./utils/notify')
const { DocumentSearch } = require('./models/document-search.model')
const { DocumentResult } = require('./models/document-result.model')

const main = async () => {
    startMongoose()

    const documentSearches = await DocumentSearch.find()
    documentSearches.forEach(async (documentSearch) => {
      let docs = await search(documentSearch.searchString, 1)
      if (docs.length <= 0) {
        console.log(`No documents for search "${documentSearch.searchString}"`)
        return
      }

      let docId = docs[0].topic
      let docName = docs[0].name
      let docHtml = await getHtml(docId)
      if (!docHtml.success) {
        console.log(`Document ${docId} not found`)
        return
      }
      let texts = []
      let formulas = []
      await docHtml.items.forEach(async (element) => {
        const result = await findFormulaAndLocation(element.text)
        texts.push({
          page: element.number,
          text: element.text
        })
        result.forEach((formula, index) => formulas.push({
          pageLocation: element.number,
          pageOrder: index + 1,
          documentLocation: formula.blockId,
          documentOrder: formula.position + 1,
          text: formula.text
        }))
      })

      const previousDocumentResult = await DocumentResult.findOne({ documentSearch: documentSearch }, null, { sort: { dateParsed: -1 } })

      const documentResult = new DocumentResult({
        documentSearch: documentSearch,
        dateParsed: new Date(),
        formulas: formulas,
        texts: texts
      })
      await documentResult.save()
      console.log(`Document ${docId} parsed`)

      if (!previousDocumentResult) {
        console.log('No previous document result')

        return
      }

      await notifyResults(compareDocuments(previousDocumentResult, documentResult), docHtml.headline, docName, 'console')
    })
  }

main()
