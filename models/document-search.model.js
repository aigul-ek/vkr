const mongoose = require('mongoose')

const documentSearchSchema = new mongoose.Schema({
    searchString: String
  })

const DocumentSearch = mongoose.model('DocumentSearch', documentSearchSchema)

exports.DocumentSearch = DocumentSearch
