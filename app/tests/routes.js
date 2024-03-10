const router = require('express').Router();
const controllers = require('./controllers');
const { authenticateUser, adminAuthMiddleware }= require('../common/middleware')
const validators = require('./validators');

router.get('/list', authenticateUser, controllers.getTestLists)
router.get('/get-test/:id', validators.id, authenticateUser, controllers.accessTestQuestions)
router.post('/test-session/start/:id', authenticateUser, controllers.startTest)
router.post('/post-answer/:id', authenticateUser, controllers.addAnswerToTest)

// Admin APIs
router.get('/admin/get-test', controllers.getTestsForAdmin)
router.get('/admin/get-test/:id', validators.id, controllers.getTestByIdforAdmin)
router.post('/admin/add-test', validators.addTest, controllers.addTest)
router.put('/admin/update-test/:id', validators.id, validators.addTest, controllers.updateTest)
router.post('/admin/add-question/:id', validators.addQuestionsToTest, controllers.addQuestionsToTest)
router.put('/admin/update-question/:id', validators.updateQuestion, controllers.updateQuestion)
router.get('/admin/publish-test/:id', validators.addQuestionsToTest, controllers.publishTest)
router.post('/admin/add-image', validators.addImage, controllers.addImagesToTest)
router.get('/admin/get-image/:id', controllers.getTestImages)
router.put('/admin/update-image/:id', controllers.updateImage)


module.exports = router;