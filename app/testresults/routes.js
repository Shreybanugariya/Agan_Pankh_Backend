const router = require('express').Router();
const controllers = require('./controllers');
const { authenticateUser }= require('../common/middleware')

router.post('/submit-test/:id', authenticateUser, controllers.submitTest)
router.get('/show-results/:id', authenticateUser, controllers.showResults)

module.exports = router;