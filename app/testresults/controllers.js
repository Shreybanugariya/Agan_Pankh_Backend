const { submitTestAndCalulateResult } = require('../common/functions');
const controller = {}

controller.submitTest = async (req, res) => {
    try {
        const testId = req.params.id
        const userId = req.user._id
        const score = await submitTestAndCalulateResult({ userId, testId })
        if (score.toString === 'false') return res.reply(message.no_prefix('There is an issue in submitting the test, Please contact Admin'))
        return res.reply(message.success('Test Fetch'), { data: testResult })
    } catch (error) {
        console.log(error)
        return res.status(401).json({ success: false, error: 'Something Went Wrong' });
    }
}

controller.submitTestSession = async (req, res) => {

}
module.exports = controller