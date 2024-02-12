const router = require('express').Router()
const userRoute = require('./users/routes')
const testRoute = require('./tests/routes')
const testResultRoute = require('./testresults/routes')
const paymentRoute = require('./payments/routes')

router.use('/users', userRoute)
router.use('/tests', testRoute)
router.use('/test-results', testResultRoute)
router.use('/payment', paymentRoute)

module.exports = router
