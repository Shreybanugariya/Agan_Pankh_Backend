const common = {}
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const Tests = require('../tests/model')
const TestResults = require('../testresults/model')

common.verifyGoogleToken = async (token) => {
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID, 
    });
    const payload = ticket.getPayload();
    return payload;
}

common.checkPreviousTestCleared = async (userId, testIndex) => {
  try {
    const previousTest = await Tests.findOne({ userId, testIndex }, { _id: 1 }).lean()
    const previousTestResult = await TestResults.findOne({ userId, testId: previousTest._id }, { score: 1}).lean()
    if (!previousTestResult || previousTestResult.score === 0) return false
    return true
  } catch (error) {
    console.log(error);
  }
}

common.submitTestAndCalulateResult = async ({ userId, testId }) => {
  const test = await Tests.findById(testId);
  const testResults = TestResult.findOne({ userId, testId, isCompleted: false }).lean()

  if (!test || !testResults) return false
  const { answers } = testResults
  if (!answers.length) return false

  let score = 0;
  for (const userAnswer of answers) {
      const question = test.questions.find(q => q._id.equals(userAnswer.question));

      const selectedOptions = question.options.filter(option => userAnswer.selectedOptions.includes(option._id.toString()));
      const correctOptions = question.options.filter(option => option.isCorrect);

      if (selectedOptions.length === correctOptions.length && selectedOptions.every(option => option.isCorrect)) score++;
  }
  // Complete the test
  await TestResult.updateOne({ _id: testResults._id }, { isCompleted: true });
  return score;
}

module.exports = common