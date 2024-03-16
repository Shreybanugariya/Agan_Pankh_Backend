const router = require('express').Router();
const controllers = require('./controllers');
const { authenticateUser, adminAuthMiddleware }= require('../common/middleware')
const { createUser, updateUser } = require('./validators')

router.get('/', authenticateUser, controllers.getLoggedInUser)
router.get('/:id', authenticateUser, controllers.getUser)
router.post('/auth/google-signin', createUser, controllers.googleSingIn)
router.put('/update/:id?', updateUser, authenticateUser, controllers.updateUser)

// Admin
router.post('/admin/auth/login', controllers.adminLogin)
router.get('/admin/getUsers',  adminAuthMiddleware,  controllers.adminGetUsers)
router.post('/admin/add-user', adminAuthMiddleware, controllers.adminAddUsers)
router.delete('/admin/delete-user/:id', adminAuthMiddleware, controllers.adminGetUsers)

module.exports = router;
