const router = require('express').Router();
const controllers = require('./controllers');
const { authenticateUser, adminAuthMiddleware }= require('../common/middleware')
const validators = require('./validators');

router.get('/list', authenticateUser, controllers.getTestLists)
router.get('/get-test/:id', authenticateUser, controllers.accessTestQuestions)
router.post('/test-session/start/:id', authenticateUser, controllers.startTest)
router.post('/post-answer/:id', authenticateUser, controllers.addAnswerToTest)

// Admin APIs
router.post('/admin/add-test', adminAuthMiddleware, validators.addTest, controllers.addTest)
router.put('/admin/update-test/:id', adminAuthMiddleware, validators.addTest, controllers.updateTest)
router.post('/admin/add-question/:id', adminAuthMiddleware, validators.addQuestionsToTest, controllers.addQuestionsToTest)
router.put('/admin/update-question/:id', validators.updateQuestion, controllers.updateQuestion)
router.get('/admin/publish-test/:id', adminAuthMiddleware, validators.addQuestionsToTest, controllers.publishTest)
router.post('/admin/add-image', adminAuthMiddleware, validators.addImage, controllers.addImagesToTest)
router.get('/admin/get-image/:id', adminAuthMiddleware, controllers.getTestImages)
router.put('/admin/update-image/:id', adminAuthMiddleware, controllers.updateImage)


module.exports = router;