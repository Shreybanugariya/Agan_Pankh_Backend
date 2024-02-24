const router = require('express').Router();
const controllers = require('./controllers');
const { authenticateUser }= require('../common/middleware')

router.post('/create-payment', authenticateUser, controllers.createOrder)
router.post('/order/capture-payment', controllers.paymentCapture) // Webhook
router.post('/create-payment/upi', authenticateUser, controllers.createUPILink)
router.post('/check-promo', authenticateUser, controllers.checkPromo)

module.exports = router;