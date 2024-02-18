const router = require('express').Router();
const controllers = require('./controllers');
const authMiddleware = require('../common/middleware')

router.post('/create-payment', authMiddleware, controllers.createOrder)
router.get('/order/capture-payment', controllers.paymentCapture) // Webhook
router.post('/create-payment/upi', authMiddleware, controllers.createUPILink)

module.exports = router;