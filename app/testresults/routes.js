const router = require('express').Router();
const controllers = require('./controllers');
const authMiddleware = require('../common/middleware')

router.post('/submit', authMiddleware, controller.submitTest)

module.exports = router;