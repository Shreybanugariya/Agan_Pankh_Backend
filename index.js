require('./globals')
require('dotenv').config()
const { mongodb } = require('./utils')

require('./app/app')
mongodb.initialize()