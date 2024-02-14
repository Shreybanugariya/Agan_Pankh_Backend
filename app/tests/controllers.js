const Tests = require('./model')
const TestSession = require('./testSession.model')
const TestResult = require('../testresults/model')
const { checkPreviousTestCleared, submitTestAndCalulateResult } = require('../common/functions')
const ObjectId = require('mongoose').Types.ObjectId

const controllers = {}

controllers.getTestLists = async (req, res) => {
    try {
        const tests = await Tests.find({}, { testName: 1, totalQuestions: 1, duration: 1, testIndex : 1 }).sort({ testIndex: 1 }).lean()
        if (!tests.length) return res.status(400).json({ message: 'There was an error Loading the test, Please try again later.' })
        const user = req.user
        for (const t of tests) {
            t.isLocked = true
            t.testGiven = false
            const checkResults = await TestResult.findOne({ userId: user._id, testId: t._id }, { score: 1, isCompleted: 1 }).lean()
            if (checkResults) {
                t.isOnGoing = !checkResults.isCompleted
                t.testGiven = checkResults.isCompleted
                t.isLocked = checkResults.isCompleted
                t.score = checkResults.score
            } else if (user.hasPreminum && t.testIndex === 0) t.isLocked = false
            else if (user.currentTestIndex === t.testIndex) t.isLocked = false 
        }
        return res.reply(message.success('Test Fetch'), { data: tests })
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: 'Something went wrong' });
    }
}

controllers.accessTestQuestions = async (req, res) => {
    try {
        if (!req.params.id) return res.status(419).json({ message: 'Id is required'})
        const userId = req.user._id
        const testId = req.params.id
        if (!req.user.hasPreminum) return res.reply(message.no_prefix('Payment not completed, Please try again later'));

        const test = await Tests.findById(testId, { 'questions.options.isCorrect': 0 }).lean()
        if (!test) return res.status(404).json({ message: 'Test not found'})
        if (!test.questions.length) return res.status(404).json({ message: 'Test Questions not found'})

        const testresults = await TestResult.findOne({ userId, testId }, { isCompleted: 1, score: 1}).lean();
        if (testresults && !testresults.isCompleted) {
            const testSession = await TestSession.findOne({ userId, testId }, { startTime: 1, endTime: 1 })
            return res.status(200).json({ message: 'Test is on going', test, testSession, questionsAttempted: testresults.answers })
        } else if (testresults && testresults.isCompleted) return res.status(200).json({ message: 'Test completed', score: testresults.score })

        if (test.testIndex > 0) {
            const check = await checkPreviousTestCleared({ userId: req.user._id, testIndex: test.testIndex })
            if (!check) return res.status(400).json({ messa: 'Previous test not cleared' })
        }
        return res.reply(message.success('Test Fetch'), { data: test })
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: 'Something Went Wrong' });
    }
}

controllers.startTest = async (req, res) => {
    try {
        const { testId } = req.body;
        const userId = req.user._id
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
        res.status(400).json({ success: false, error: 'Something Went Wrong' });
    }
}

controllers.addAnswerToTest = async (req, res) => {
    try {
        const { id: testId } = req.params
        const { _id: userId } = req.user

        const checkTestSession = await TestSession.findOne({ userId, testId }).lean()
        if (!checkTestSession) {
            const score = await submitTestAndCalulateResult({ userId, testId })
            return res.status(200).json({ message: 'Test Completed', score: score})
        }

        const { questionIndex, selectedOptionIndex } = req.body;
        if (!questionIndex.toString() || !selectedOptionIndex.toString() || selectedOptionIndex < 0) return res.status(400).json({ error: 'Invalid input' });   
        const testResult = await TestResult.findOne({ userId, testId })
        const { answers } = testResult
        if (!answers.length) answers.push({
            questionIndex,
            selectedOptionIndex
        })
        else {
            const existingAnswerIndex = answers.findIndex(
                answer => answer.questionIndex === questionIndex
            );
            if (existingAnswerIndex !== -1) {
                answers[existingAnswerIndex].selectedOptionIndex = selectedOptionIndex;
            }
            else {
                answers.push({
                    questionIndex,
                    selectedOptionIndex
                });
            }
        }
        await testResult.save()
        return res.status(200).json({ message: 'Answer updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: 'Something Went Wrong' });
    }
}
module.exports = controllers