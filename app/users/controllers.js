const User = require('./model')
const { verifyGoogleToken } = require('../common/functions')
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const controllers = {}

controllers.googleSingIn = async (req, res) => {
    try {
        const { idToken } = req.body;
        const userData = await verifyGoogleToken(idToken);
        const { sub, email } =  userData
        const authToken = jwt.sign({ googleId: sub }, JWT_SECRET_KEY, { expiresIn: '300d' })
        const user = await User.create({ email, googleId: sub, authToken })
        return res.reply(message.success('Login'), { data: user })
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ success: false, error: 'Invalid Google Sign-In token' });
    }
}

module.exports = controllers