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
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            const authToken = jwt.sign({ googleId: sub }, JWT_SECRET_KEY, { expiresIn: '300d' })
            const user = await User.updateOne({ email }, { googleId: sub, authToken })
            existingUser.isNew = false
            existingUser.authToken = authToken
            return res.reply(message.success('Login'), { data: existingUser })
        }
        const authToken = jwt.sign({ googleId: sub }, JWT_SECRET_KEY, { expiresIn: '300d' })
        const user = await User.create({ email, googleId: sub, authToken })
        user.isNew = true
        return res.reply(message.success('Login'), { data: user })
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ success: false, error: 'Invalid Google Sign-In token' });
    }
}

controllers.getUser = async (req, res) => {
    try {
        if (!req.user.isAdmin && req.user._id.toString() !== req.params.id) return res.status(401).json({ message: 'Access Denied' })
        const user = await User.findById(req.params.id, { authToken: 0, __v: 0})
        if (!user) return res.status(401).json({ message: 'User not Found' })
        return res.reply(message.success('User'), { data: user })
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ success: false, error: 'User not found' });
    }
}

controllers.updateUser = async (req, res) => {
    try {
        req.body = _.pick(req.body, ['username', 'contactNo', 'password', 'city', 'isActive'])
        const user = await User.findById(req.params.id, { authToken: 0 })
        if (!user) return res.status(401).json({ message: 'User not Found' })

        await User.updateOne({ _id: req.params.id }, req.body )
        return res.reply(message.success('User Update'))
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ success: false, error: 'User not found' });
    }
}

module.exports = controllers