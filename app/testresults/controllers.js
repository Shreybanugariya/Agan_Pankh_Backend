const { submitTestAndCalulateResult } = require('../common/functions');
const TestSession = require('../tests/testSession.model')
const controller = {}

controller.submitTest = async (req, res) => {
    try {
        const testId = req.params.id
        const userId = req.user._id
        const { answers } = req.body
        await TestSession.deleteOne({ userId, testId }).lean()

        const score = await submitTestAndCalulateResult({ userId, testId }, answers)
        if (score.toString === 'false') return res.reply(message.no_prefix('There is an issue in submitting the test, Please contact Admin'))
        
        return res.reply(message.success('Test Submited'), { score })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, error: 'Something Went Wrong' });
    }
}

controller.submitTestSession = async (req, res) => {

}
module.exports = controller