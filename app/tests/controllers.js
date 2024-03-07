const Tests = require('./model')
const TestSession = require('./testSession.model')
const TestImage = require('./testImages.model')
const TestResult = require('../testresults/model')
const { checkPreviousTestCleared, submitTestAndCalulateResult } = require('../common/functions')
const ObjectId = require('mongoose').Types.ObjectId

const controllers = {}

controllers.getTestLists = async (req, res) => {
    try {
        const tests = await Tests.find({}, { testName: 1, totalQuestions: 1, duration: 1, testIndex : 1, readyToShow: 1, testReleaseDate: 1 }).sort({ testIndex: 1 }).lean()
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
            else if (user.currentTestIndex === t.testIndex && t.testIndex !== 0) t.isLocked = false 
            if (!t.readyToShow) t.isLocked = true
            if (['hirenjogi.82@gmail.com', 'tejbanugariya@gmail.com', 'shreybanugariya@gmail.com', 'kandarpdangi@gmail.com'].includes(req.user.email) && t.testIndex == 1) {
                t.isLocked = false
                t.readyToShow = false
            }
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
        if (!req.user.hasPreminum) return res.status(400).json({ success: false, error: 'પ્રીમિયમ ખરીદવામાં આવતું નથી. તમામ ટેસ્ટ પેપર એક્સેસ કરવા માટે કૃપા કરીને પ્રીમિયમ ખરીદો' });
        const testSession = await TestSession.findOne({ userId, testId }, { startTime: 1, endTime: 1 })
        if (!testSession) return res.status(400).json({ success: false, error: 'Test Questions cannot be accessed without Starting the Test' });

        const test = await Tests.findById(testId, { 'questions.options.isCorrect': 0 }).lean()
        if (!test) return res.status(404).json({ message: 'Test not found'})
        if (!test.questions.length) return res.status(404).json({ message: 'Test Questions not found'})

        const testresults = await TestResult.findOne({ userId, testId }, { isCompleted: 1, score: 1, answers: 1, isVisited: 1, isReviewed: 1 }).lean();
        if (testresults && !testresults.isCompleted) {
            const questionsAttempted = [];
            const {answers, isVisited, isReviewed} = testresults
            for (const question of test.questions) {
                const questionIndex = question.questionIndex;
                const mergedObject = { questionIndex };

                const answer = answers.find(ans => ans.questionIndex === questionIndex);
                if (answer) mergedObject.selectedOptionIndex = answer.selectedOptionIndex;

                if (isVisited.includes(questionIndex)) mergedObject.isVisited = true;
                if (isReviewed.includes(questionIndex)) mergedObject.isReviewed = true;

                if (answer || mergedObject.isVisited || mergedObject.isReviewed) questionsAttempted.push(mergedObject);
            }
            return res.status(200).json({ message: 'Test is on going', test, testSession, questionsAttempted })
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
        if (!req.user.hasPreminum) return res.status(400).json({ error: 'પ્રીમિયમ પ્લાન હજુ ખરીદાયો નથી. કૃપા કરીને તમામ ટેસ્ટ ઍક્સેસ કરવા માટે પ્રીમિયમ પ્લાન ખરીદો' });
        const test = await Tests.findById(testId).lean()
        if (!test) return res.reply(message.not_found('Test'))
        if (!test.readyToShow) return res.status(404).json({ error: 'આ ટેસ્ટ ટૂંક સમયમાં ઉપલબ્ધ થશે' });
        if ((await checkPreviousTestCleared( userId, test.testIndex ))) return res.reply(message.invalid_req('અગાઉની ટેસ્ટ ક્લિયર થઈ નથી, કૃપા કરીને અગાઉની ટેસ્ટ પૂર્ણ કરો'))

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
        const testResult = await TestResult.findOne({ userId, testId })
        if (!checkTestSession) {
            if (!testResult) return res.status(400).json({ message: 'Test Not Started'})
            const score = await submitTestAndCalulateResult({ userId, testId })
            return res.status(400).json({ message: 'Test Already Completed', score: score})
        }

        const { questionIndex, selectedOptionIndex, isVisited, isReviewed } = req.body;
        if (questionIndex === null) return res.status(400).json({ error: 'Question Index Required' });
        if (selectedOptionIndex === null && (!isVisited || !isReviewed)) return res.status(400).json({ error: 'Invalid request object' });

        if (isReviewed) {
            const { isReviewed } = testResult
            if (!isReviewed.length) isReviewed.push(questionIndex)
            else {
                const index = isReviewed.indexOf(questionIndex)
                if (index !== -1) testResult.isReviewed = isReviewed.filter(item => item !== questionIndex)
                else isReviewed.push(questionIndex)
            }
        }
        if (selectedOptionIndex?.toString()) {
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
        }
        if (isVisited) {
            const { isVisited } = testResult
            if (!isVisited.length) isVisited.push(questionIndex)
            else {
                const index = isVisited.indexOf(questionIndex)
                if (index === -1) testResult.isVisited.push(questionIndex)
            }
        }
        await testResult.save()
        return res.status(200).json({ message: 'Answer updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: 'Something Went Wrong' });
    }
}


// ********************* Admin APIs ****************************
controllers.addTest = async (req, res) => {
    try {
        const { testName = "New Test", totalQuestions = 100, duration = 60 } = req.body;
        const test = await Tests.findOne({}, { testIndex: 1}).sort({ testIndex: -1 }).lean();
        const testIndex = test? test.testIndex + 1 : 0;
        const newTest = await Tests.create({ testName, totalQuestions, duration, testIndex, readyToShow: false});

        if (newTest) return res.status(200).json({ message: 'Test Added Successfully', test: newTest })
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: 'Something Went Wrong' });
    }
}

controllers.updateTest = async (req, res) => {
    try {
        const { id } = req.params;
        const test = await Tests.updateOne({ _id: id }, req.body);
        if (test) return res.status(200).json({ message: 'Test Added Successfully', test: newTest })
        return res.status(400).json({ message: 'Error while updating test' })
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: 'Something Went Wrong' });
    }
}

controllers.addQuestionsToTest = async (req, res) => {
    try {
        const { id } = req.params
        const { questions } = req.body
        const test = await Tests.findById(id)
        if (!test) return res.status(404).json({ message: 'Test not found' })

        if (!questions.length) {
            test.questions = questions
            await test.save()
            return res.status(200).json({ message: 'Questions Added Successfully' })
        }
        if (questions.length > test.totalQuestions) return res.status(400).json({ message: 'Enough Questions Already' })
        for (const question of questions) {
            test.questions.push(question)
        }
        await test.save()
        return res.status(200).json({ message: 'Questions Added Successfully' })
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: 'Something Went Wrong' });
    }
}

controllers.updateQuestion = async (req, res) => {
    try {
        const { id } = req.params
        const { question } = req.body
        const testUpdate = await Tests.findOneAndUpdate({ _id: id, 'questions.questionIndex': question.questionIndex }, { $set: { 'questions.$': question } }, { new: true })
        if (testUpdate) return res.status(200).json({ message: 'Question Updated Successfully', data: testUpdate.questions[1] })
        return res.status(400).json({ message: 'There was an error updating the question' })
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: 'Something Went Wrong' });
    }
}

controllers.updateImage = async (req, res) => {
    try {
        const { id } = req.params
        const { imageUrl } = req.body
        const testUpdate = await TestImage.findOneAndUpdate({ _id: id }, { $set: { imageUrl } }, { new: true })
        if (testUpdate) return res.status(200).json({ message: 'Image Updated Successfully', data: testUpdate.image })
        return res.status(400).json({ message: 'There was an error updating the image' })
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: 'Something Went Wrong' });
    }
}

controllers.publishTest = async (req, res) => {
    try {
        const { id } = req.params
        const { publishTest } = req.query
        const test = await Tests.findById(id)
        if (!test) return res.status(404).json({ message: 'Test not found' })
        if (!publishTest) {
            if (!test.readyToShow) return res.status(400).json({ message: 'Test is already Un-Published' })
            test.readyToShow = false
            await test.save()
            return res.status(200).json({ message: 'Test Un-Published Successfully' })
        }
        if (test.questions.length !== test.totalQuestions) return res.status(400).json({ message: `${ test.totalQuestions} Should be added to Publish the test` })
        test.readyToShow = true
        await test.save()
        return res.status(200).json({ message: 'Test Published Successfully' })
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: 'Something Went Wrong' });
    }
}

controllers.addImagesToTest = async (req, res) => {
    try {
        const { images, testId } = req.body
        let payload = []
        if (images.length) {
            for (const image of images) {
                payload.push({ testId, imageUrl: image })
            }
        }
        const testImage = await TestImage.create(payload)
        if (testImage) return res.status(200).json({ message: 'Image Added Successfully' })
        return res.status(400).json({ message: 'There is an error creating the Image' })
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: 'Something Went Wrong' });
    }
}

controllers.getTestImages = async (req, res) => {
    try {
        const { id } = req.params
        const { limit = 30, offset=0 } = req.query
        const test = await Tests.findById(id)
        if (!test) return res.status(404).json({ message: 'Test not found' })
        const testImages = await TestImage.find({ testId: test._id }).limit(limit).skip(offset).lean()
        if (!testImages.length) return res.status(404).json({ message: 'Test Images not found' })
        return res.status(200).json({ testImages })
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: 'Something Went Wrong' });
    }
}

controllers.getTestsForAdmin = async (req, res) => {
    try {
        const { limit = 30, offset = 0 } = req.query
        const tests = await Tests.find({}, { questions: 0 }).sort({ testIndex: 1 }).limit(limit).skip(offset).lean()
        if (!tests.length) return res.status(404).json({ message: 'Tests not found' })
        return res.status(200).json({ tests })
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: 'Something Went Wrong' });
    }
}
module.exports = controllers