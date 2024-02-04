const TestResult = require('./model')
const Tests = require('../tests/model')

const controller = {}

controller.submitTest = async (req, res) => {
    try {   
        const { userId, testId, answers, score, submittedAt } = req.body
        const alreadyGiven = await TestResult.findOne({ userId, testId }, { score: 1, _id: 1 }).lean()
        if (alreadyGiven) await TestResult.updateOne({ _id: alreadyGiven._id }, { score })
        else await TestResult.create({ userId, testId, answers, score, submittedAt })
    } catch (error) {
        console.log(error)
        return res.status(401).json({ success: false, error: 'Something Went Wrong' });
    }
}

module.exports = controller