const { search, getHtml } = require('./utils/garant')
const { extractAndReplaceFormulaString } = require('./utils/regex')
const { startMongoose } = require('./utils/mongoose')
const { DocumentSearch } = require('./models/document-search.model')
const { DocumentResult } = require('./models/document-result.model')

const main = async () => {
    startMongoose()

    const documentSearches = await DocumentSearch.find()
    documentSearches.forEach(async (documentSearch) => {
      let docs = await search(documentSearch.searchString, 1)
      if (docs.lenght === 0) {
        return
      }

      let docId = docs[0].topic
      let docHtml = await getHtml(docId)
      let texts = []
      let formulas = []
      docHtml.items.forEach((element) => {
        const result = extractAndReplaceFormulaString(element.text)
        texts.push({
          page: element.number,
          text: result.modifiedString
        })
        Object.keys(result.formulas).forEach((formulaGuid, index) => formulas.push({
          pageLocation: element.number,
          pageOrder: index,
          documentGuid: formulaGuid,
          text: result.formulas[formulaGuid]
        }))
      })

      const previousDocumentResult = await DocumentResult.findOne({ documentSearch: documentSearch }, null, { sort: { dateParsed: -1 } })

      const documentResult = new DocumentResult({
        documentSearch: documentSearch,
        dateParsed: new Date(),
        formulas: formulas,
        texts: texts
      });
      await documentResult.save()

      if (!previousDocumentResult) {
        console.log('No previous document result')

        return
      }

      previousFormulas = {}
      previousDocumentResult.formulas.forEach((formula) => { previousFormulas[`${formula.pageLocation}:${formula.pageOrder}`] = formula.text })
      let changeCounter = 0
      formulas.forEach((formula) => {
        const key = `${formula.pageLocation}:${formula.pageOrder}`
        if (!previousFormulas[key]) {
          changeCounter++
          console.log(`Formula ${key} is new`)
        } else if (previousFormulas[key] !== formula.text) {
          changeCounter++
          console.log(`Formula ${key} has changed`)
        }
        delete previousFormulas[key]
      })

      if (Object.keys(previousFormulas).length > 0) {
        changeCounter++
        console.log(`Document for search "${documentSearch.searchString}" has ${Object.keys(previousFormulas).length} removed formulas`)
      }

      if (changeCounter <= 0) {
        console.log(`Document for search "${documentSearch.searchString}" has no changes`)
      }
    })
  }

main()
