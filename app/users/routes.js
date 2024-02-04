const router = require('express').Router();
const controllers = require('./controllers');

router.post('/auth/google-singin', controllers.googleSingIn)

module.exports = router;