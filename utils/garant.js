const axios = require('axios')

const garantApi = process.env.GARANT_API
const garantToken = process.env.GARANT_TOKEN

module.exports.search = async (text, limit = 5) => {
    const res = await axios.post(`${garantApi}/search`,
        {
            'text': text,
            'count': limit,
            'kind': ['001', '002'],
            'sort': 0,
            'sortOrder': 0
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${garantToken}`
          }
        }
      )

    return res.data.documents
}

module.exports.getHtml = async (docId) => {
    const res = await axios.get(`${garantApi}/topic/${docId}/html`,
        {
          headers: {
            'Authorization': `Bearer ${garantToken}`
          }
        }
      )

    return res.data
}
