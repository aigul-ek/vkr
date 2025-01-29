const { startMongoose } = require('./utils/mongoose')
const { DocumentSearch } = require('./models/document-search.model')

const main = async () => {
    startMongoose()

    const promises = []

    const documentSearchFirst = new DocumentSearch({
      searchString: "О требованиях к осуществлению дилерской, брокерской деятельности, деятельности по управлению ценными бумагами и деятельности форекс-дилеров в части расчета показателя достаточности капитала"
    });
    promises.push(documentSearchFirst.save())

    const documentSearchSecond = new DocumentSearch({
      searchString: "О требованиях к финансовой устойчивости и платежеспособности страховщиков"
    });
    promises.push(documentSearchSecond.save())

    await Promise.all(promises)
      .then(() => {
        console.log('Documents created')
      })
      .finally(() => {
        process.exit()
      })
  }

main()
