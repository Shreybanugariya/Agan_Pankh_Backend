const router = require('express').Router();
const controllers = require('./controllers');
const authMiddleware = require('../common/middleware')

router.post('/submit-test/:id', authMiddleware, controllers.submitTest)
router.get('/show-results/:id', authMiddleware, controllers.showResults)

module.exports = router;