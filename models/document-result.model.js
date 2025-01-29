const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId

const documentResultSchema = new mongoose.Schema({
    documentSearch: {
      type: ObjectId,
      ref: 'DocumentSearch',
      required: true
    },
    dateParsed: {
      type: Date,
      required: true
    },
    formulas: [
      {
        pageLocation: String,
        pageOrder: Number,
        documentLocation: String,
        documentOrder: Number,
        text: String
      }
    ],
    texts: [
      {
        page: String,
        text: String
      }
    ]
  })

const DocumentResult = mongoose.model('DocumentResult', documentResultSchema)

exports.DocumentResult = DocumentResult
