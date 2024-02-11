const router = require('express').Router();
const controllers = require('./controllers');
const authMiddleware = require('./middleware')

router.post('/create-payment', authMiddleware, controllers.createOrder)
router.post('/order/capture-payment', controllers.paymentCapture) // Webhook
router.post('/create-payment/upi', authMiddleware, controllers.createUPILink)

module.exports = router;