const router = require('express').Router();
const controllers = require('./controllers');
const authMiddleware = require('../common/middleware')
const { createUser, updateUser } = require('./validators')

router.get('/', authMiddleware, controllers.getLoggedInUser)
router.get('/:id', authMiddleware, controllers.getUser)
router.post('/auth/google-signin', createUser, controllers.googleSingIn)
router.put('/update/:id?', updateUser, authMiddleware, controllers.updateUser)

module.exports = router;
