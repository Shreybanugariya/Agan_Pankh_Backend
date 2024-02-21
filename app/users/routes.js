const router = require('express').Router();
const controllers = require('./controllers');
const { authenticateUser }= require('../common/middleware')
const { createUser, updateUser } = require('./validators')

router.get('/', authenticateUser, controllers.getLoggedInUser)
router.get('/:id', authenticateUser, controllers.getUser)
router.post('/auth/google-signin', createUser, controllers.googleSingIn)
router.put('/update/:id?', updateUser, authenticateUser, controllers.updateUser)

module.exports = router;
