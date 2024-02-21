const router = require('express').Router();
const controllers = require('./controllers');
const authMiddleware = require('../common/middleware')

router.get('/list', authMiddleware, controllers.getTestLists)
router.get('/get-test/:id', authMiddleware, controllers.accessTestQuestions)
router.post('/test-session/start/:id', authMiddleware, controllers.startTest)
router.post('/post-answer/:id', authMiddleware, controllers.addAnswerToTest)

// Admin APIs
// router.post('/admin/add-test', controllers.addTest)

module.exports = router;