const router = require('express').Router();
const controllers = require('./controllers');
const authMiddleware = require('../common/middleware')
const { createUser, updateUser } = require('./validators')

router.get('/:id', authMiddleware, controllers.getUser)
router.post('/auth/google-singin', createUser, controllers.googleSingIn)
router.put('/:id', updateUser, authMiddleware, controllers.updateUser)

module.exports = router;