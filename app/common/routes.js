const router = require('express').Router();
const controllers = require('./controllers');
const authMiddleware = require('../common/middleware')


router.post('/create-payment', authMiddleware, controllers.createPayment)

module.exports = router;