const User = require('./model')
const { verifyGoogleToken } = require('../common/functions')
const jwt = require('jsonwebtoken');
const TestResult = require('../testresults/model');
const TestSessions = require('../tests/testSession.model');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const controllers = {}

controllers.googleSingIn = async (req, res) => {
    try {
        const { idToken } = req.body;
        const userData = await verifyGoogleToken(idToken);
        const { sub, email } =  userData
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser ) {
            const authToken = jwt.sign({ googleId: sub }, JWT_SECRET_KEY, { expiresIn: '300d' })
            await User.updateOne({ email }, { googleId: sub, authToken })
            if (!existingUser.contactNo || !existingUser.city) {
                existingUser.isNew = true
                existingUser.authToken = authToken
                return res.reply(message.success('Login'), { data: existingUser })
            }
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
        const user = await User.findById(req.params.id, { _id: 1 }).lean()
        if (!user) return res.status(400).json({ message: 'User not Found' })

        await User.updateOne({ _id: req.params.id }, req.body )
        return res.status(200).json({ message: 'User Update Success'})
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: 'User not found' });
    }
}

// ******************** Admin  *************************

controllers.getLoggedInUser = async (req, res) => {
    try {
        return res.reply(message.success('Logged In User details fetch'), req.user)
    } catch (error) {
        return res.status(404).json({ message: 'Somethings went wrong while fetching the Loggedin User' })
    }
}

controllers.adminGetUsers = async (req, res) => {
    try {
        // if (!req.user.isAdmin) return res.status(400).json({ message: 'Access Denied' })
        const users = await User.find({}).lean()
        const totalUsers = users.length
        const subscribedUsers = users.filter((user) => user.hasPreminum ).length
        return res.status(200).json({ message: 'Users Fetch', data: { totalUsers, subscribedUsers } })
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: 'Something Went Wrong' });
    }
}

controllers.adminDeleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(req.params.id, { _id: 1 }).lean()
        if (!user) return res.status(400).json({ message: 'User not Found' })
        const testSessions = await TestSessions.find({ userId: id })
        if (!testSessions) return res.status(400).json({ message: 'User has a test going on' })
        await TestResult.deleteMany({ userId: id })
        await User.deleteOne({ _id: req.params.id })
        return res.status(200).json({ message: 'User Deleted Successfully' })
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: 'Something Went Wrong' });
    }
}

controllers.adminAddUsers = async (req, res) => {
    try {
        if (!req.user.isAdmin) return res.status(400).json({ message: 'Access Denied' })
        req.body = _.pick(req.body, ['username', 'email', 'contactNo', 'city', 'hasPreminum', 'promoCode'])
        const authToken = jwt.sign({ email: email }, JWT_SECRET_KEY, { expiresIn: '300d' })
        req.body.authToken = authToken
        const user = await User.create(req.body)
        return res.status(200).json({ message: 'User Added Successfully', data: user })
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: 'Something Went Wrong' });
    }
}

controllers.adminLogin = async (req, res) => {
    try {
        req.body = _.pick(req.body, ['email', 'password'])
        req.body.password = _.encryptPassword(req.body.password);
        const user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(400).json({ message: 'User not found' })
        if (!user.isAdmin) return res.status(401).json({ message: 'In Valid Access' })
        if (user.password !== req.body.password) return res.status(401).json({ message: 'In Valid Password' })
        const authToken = jwt.sign({ email: user.email }, JWT_SECRET_KEY, { expiresIn: '300d' })
        user.authToken = authToken
        return res.status(200).json({ message: 'Admin Login Success', data: user })
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: 'Something Went Wrong' });
    }
}
module.exports = controllers