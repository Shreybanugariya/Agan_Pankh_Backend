const Tests = require('./model')
const TestSession = require('./testSession.model')
const TestResult = require('../testresults/model')
const { checkPreviousTestCleared, submitTestAndCalulateResult } = require('../common/functions')
const ObjectId = require('mongoose').Types.ObjectId

const controllers = {}

controllers.getTestLists = async (req, res) => {
    try {
        const tests = await Tests.find({}, { testName: 1, totalQuestions: 1, duration: 1 }).lean()
        if (!tests.length) return res.status(400).json({ message: 'There was an error Loading the test, Please try again later.' })
        const user = req.user
        for (const t of tests) {
            t.isLocked = true
            t.testGiven = false
            if (!user.hasPreminum) {
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
        res.status(401).json({ success: false, error: 'Something went wrong' });
    }
}

controllers.accessTestQuestions = async (req, res) => {
    try {
        if (!req.user.hasPreminum) return res.reply(message.no_prefix('Payment not completed, Please try again later'));

        const test = await Tests.findById(req.params.id, { 'questions.options.isCorrect': -1 }).lean()
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
        if (userId.toString() !== req.user._id.toString()) return res.reply(message.invalid_req('UserID miss match'))
        if (!req.user.hasPreminum) return res.reply(message.no_prefix('Payment not completed, Please try again later'));
        const test = await Tests.findById(testId).lean()
        if (!test) return res.reply(message.not_found('Test'))
        if (!(await checkPreviousTestCleared( userId, test.testIndex ))) return res.reply(message.no_prefix('Previous Test not cleared, please complete previous test'))

        const checkGiven = await TestResult.findOne({ userId, testId }, { _id: 1, score: 1 }).lean(test.testIndex)
        if (checkGiven) return res.reply(message.no_prefix('Test already conducted'), { score: checkGiven.score })

        const currentTime = new Date();
        const endTime = new Date(currentTime.getTime() + (60 * 60 * 1000))

        const testSession = await TestSession.create({ userId, testId, endTime })
        const testResult = await TestResult.create({ userId, testId })
        if (testSession && testResult) return res.reply(message.success('Test Started'), { data: test._id, session: testSession._id })

        return res.reply(message.no_prefix('There was an error Starting the Test. Please try again'));
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, error: 'Something Went Wrong' });
    }
}

controllers.addAnswerToTest = async (req, res) => {
    try {
        const { id: testId } = req.params
        const { _id: userId } = req.user
        const checkTestSession = await TestSession.findOne({ userId, testId: testId }).lean()
        if (!checkTestSession) {
            const score = await submitTestAndCalulateResult({ userId, testId })
            return res.status(200).json({ message: 'Test already completed', score: score})
        }
        const { questionText, selectedOptionIndex } = req.body;
        if (!questionText || selectedOptionIndex === undefined || selectedOptionIndex < 0) return res.status(400).json({ error: 'Invalid input' });
        
        const testResult = await TestResult.findOne({ userId, testId: testId });
        const test = await Tests.findById(testId).lean()

        const question = test.questions.find(question => question.questionText === questionText);
        const answerIndex = testResult.answers.findIndex(answer => answer.question === question._id);

        console.log(answerIndex, question, testResult.answers[0].question, question._id)
        if (answerIndex !== -1) {
            console.log('in if')
            testResult.answers[answerIndex].selectedOptionIndex = selectedOptionIndex;
        }
        else {
            console.log('in else', answerIndex)
            testResult.answers.push({ question: question._id, selectedOptionIndex });
        }

        console.log(testResult.answers)
        await testResult.save();
        res.status(200).json({ message: 'Answer updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, error: 'Something Went Wrong' });
    }
}
module.exports = controllers