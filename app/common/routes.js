const router = require('express').Router();
const controllers = require('./controllers');
const authMiddleware = require('./middleware')


router.post('/create-payment', controllers.createPayment)

module.exports = router;