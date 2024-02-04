const router = require('express').Router();
const controllers = require('./controllers');
const authMiddleware = require('../common/middleware')

router.get('/list', authMiddleware, controllers.getTestLists)
router.get('/questions/:id', authMiddleware, controllers.accessTestQuestions)

module.exports = router;