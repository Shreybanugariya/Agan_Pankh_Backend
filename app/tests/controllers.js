const Tests = require('./model')
const TestResult = require('../testresults/model')

const controllers = {}

controllers.getTestLists = async (req, res) => {
    try {
        const tests = await Tests.find({}).lean()
        if (!test.length) return res.status(400).json({ message: 'There was an error Loading the test, Please try again later.' })
        const user = req.user
        for (const t of tests) {
            t.isLocked = true
            t.testGiven = false
            if (!user.premium) {
                if (t.testIndex === 0) t.isLocked = false
            } else {
                if (t.testIndex <= user.currentTestIndex) t.isLocked = false
            }
            const checkResults = await TestResult.findOne({ userId: user._id, testId: t._id }, { score: 1 }).lean()
            if (checkResults) {
                t.testGiven = true
                t.score = checkResults.score
            }
        }
        return res.reply(message.success('Test Fetch'), { data: tests })
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, error: 'Invalid Google Sign-In token' });
    }
}

controllers.accessTestQuestions = async (req, res) => {
    try {
        const test = await Tests.findById(req.params.id).lean()
        if (!test) return res.status(404).json({ message: 'Test not found'})
        if (!test.questions.length) return res.status(404).json({ message: 'Test Questions not found'})
        return res.reply(message.success('Test Fetch'), { data: tests })
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, error: 'Something Went Wrong' });
    }
}

module.exports = controllers