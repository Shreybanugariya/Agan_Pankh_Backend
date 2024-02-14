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
            await User.updateOne({ email }, { googleId: sub, authToken })
            existingUser.isNew = false
            existingUser.authToken = authToken
            return res.reply(message.success('Login'), { data: existingUser })
        }
        const authToken = jwt.sign({ googleId: sub }, JWT_SECRET_KEY, { expiresIn: '300d' })
        const user = await User.create({ email, googleId: sub, authToken })
        return res.reply(message.success('Login'), { data: { id: user?._id, isNew: true, authToken} })
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: 'Invalid Google Sign-In token' });
    }
}

controllers.getUser = async (req, res) => {
    try {
        if (!req.user.isAdmin && req.user._id.toString() !== req.params.id) return res.status(400).json({ message: 'Access Denied' })
        const user = await User.findById(req.params.id, { authToken: 0, __v: 0})
        if (!user) return res.status(400).json({ message: 'User not Found' })
        return res.status(200).json({ message: 'User Fetch', data: user })
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: 'User not found' });
    }
}

controllers.updateUser = async (req, res) => {
    try {
        req.body = _.pick(req.body, ['username', 'contactNo', 'password', 'city', 'isActive'])
        if (!req.params.id) req.params.id = req.user._id
        const user = await User.findById(req.params.id, { authToken: 0 })
        if (!user) return res.status(400).json({ message: 'User not Found' })

        await User.updateOne({ _id: req.params.id }, req.body )
        return res.status(200).json({ message: 'User Update Success'})
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: 'User not found' });
    }
}

controllers.getLoggedInUser = async (req, res) => {
    try {
        return res.reply(message.success('Logged In User details fetch'), req.user)
    } catch (error) {
        return res.status(404).json({ message: 'Somethings went wrong while fetching the Loggedin User' })
    }
}

module.exports = controllers