const mongoose = require('mongoose')

const mongoHost = process.env.MONGO_HOST
const mongoPort = process.env.MONGO_PORT
const mongoDb = process.env.MONGO_INITDB_DATABASE
const mongoUser = process.env.MONGO_INITDB_ROOT_USERNAME
const mongoPass = process.env.MONGO_INITDB_ROOT_PASSWORD

module.exports.startMongoose = () => {
  mongoose
    .connect(`mongodb://${mongoHost}:${mongoPort}/${mongoDb}`, {
      authSource: 'admin',
      user: mongoUser,
      pass: mongoPass
    })
    .then(async function () {
      return console.log('Connected to MongoDB...')
    })
    .catch(error => console.error('Could not connect to MongoDB... ' + error.message))
}
