require('dotenv').config()
require('./globals')
const { mongodb } = require('./utils')

require('./app/app')
mongodb.initialize()