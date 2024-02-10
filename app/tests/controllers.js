const Tests = require('./model')
const TestSession = require('./testSession.model')
const TestResult = require('../testresults/model')
const { checkPreviousTestCleared } = require('../common/functions')

const controllers = {}

controllers.getTestLists = async (req, res) => {
    try {
        const tests = await Tests.find({}, { testName: 1, totalQuestions: 1, duration: 1 }).lean()
        if (!tests.length) return res.status(400).json({ message: 'There was an error Loading the test, Please try again later.' })
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
        if (!req.user.hasPreminum) return res.reply(messages.no_prefix('Payment not completed, Please try again later'));

        const test = await Tests.findById(req.params.id).lean()
        if (!test) return res.status(404).json({ message: 'Test not found'})
        if (!test.questions.length) return res.status(404).json({ message: 'Test Questions not found'})

        if (test.testIndex > 0) {
            const check = await checkPreviousTestCleared({ userId: req.user._id, testIndex: test.testIndex })
            if (!check) res.reply(message.no_prefix('Previous test not cleared'))
        }
        return res.reply(message.success('Test Fetch'), { data: test })
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, error: 'Something Went Wrong' });
    }
}

controllers.startTest = async (req, res) => {
    try {
        const { userId, testId } = req.body;

        //Validations
        if (!req.user.hasPreminum) return res.reply(messages.no_prefix('Payment not completed, Please try again later'));
        const test = await Tests.findById(testId).lean()
        if (!test) return res.reply(messages.not_found('Test'))
        if (!(await checkPreviousTestCleared())) return res.reply(messages.no_prefix('Previous Test not cleared, please complete previous test'))

        const currentTime = new Date();
        const endTime = new Date(currentTime.getTime() + (60 * 60 * 1000))

        const testSession = await TestSession.create({ userId, testId, endTime })
        const testResult = await TestResult.create({ userId, testId })
        if (testSession && testResult) return res.reply(message.success('Test Fetch'), { data: test })

        return res.reply(message.no_prefix('There was an error Starting the Test. Please try again'));
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, error: 'Something Went Wrong' });
    }
}

controllers.addAnswerToTest = async (req, res) => {

}
module.exports = controllers