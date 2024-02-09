const log = require('./lib/log')
const message = require('./lib/messages')
const helper = require('./lib/helper')

global.log = log
global.message = message
global._ = helper