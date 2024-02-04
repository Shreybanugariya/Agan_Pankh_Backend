const router = require('express').Router()
const userRoute = require('./users/routes')

router.use('/users', userRoute)

module.exports = router
