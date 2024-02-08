const router = require('express').Router();
const controllers = require('./controllers');
const authMiddleware = require('./middleware')


router.post('/create-payment', controllers.createOrder)
router.post('/order/capture-payment', controllers.paymentCapture)

module.exports = router;