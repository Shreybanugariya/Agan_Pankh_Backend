require('./env')
require('./globals')
const app = require('./app/app')
const { mongodb } = require('./utils')

require('./app/app')
mongodb.initialize()