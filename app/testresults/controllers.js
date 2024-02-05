const TestResult = require('./model')
const Tests = require('../tests/model')

const controller = {}

controller.submitTest = async (req, res) => {
    try {   
        const { userId, testId, answers, submittedAt } = req.body
        const alreadyGiven = await TestResult.findOne({ userId, testId }, { score: 1, _id: 1 }).lean()

        //Calculate the score
        const test = await Tests.findOne({ _id: testId }).lean()
        let calculatedScore = 0;
        answers.forEach((answer) => {
          const question = test.questions.find((q) => q.index === answer.index);
    
          if (question && answer.selectedOptionIndex === question.correctOptionIndex) {
            calculatedScore += 1;
          }
        });

        for (const t of test.questions) {
            if (t.correctOptionIndex !== answers.indexOf(t.options[t.correctOptionIndex])) {
            }
        }
        if (alreadyGiven) {
            await TestResult.updateOne({ _id: alreadyGiven._id }, { score: calculatedScore })
            return res.reply(message.success('Test ReSubmitted'), { data: { score: calculatedScore } })
        }
        const testResult = await TestResult.create({ userId, testId, answers, score: calculatedScore, submittedAt })
        delete testResult.answers
        return res.reply(message.success('Test Fetch'), { data: testResult })
    } catch (error) {
        console.log(error)
        return res.status(401).json({ success: false, error: 'Something Went Wrong' });
    }
}

module.exports = controller