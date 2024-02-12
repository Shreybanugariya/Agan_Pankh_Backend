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
    if (testIndex === 0) return true
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
  const testResults = await TestResults.findOne({ userId, testId }).lean()

  if (!test || !testResults) return false
  if (testResults.isCompleted) return testResults.score
  const { answers } = testResults
  if (!answers.length) return false

  let score = 0;
  const correctOptionsMap = new Map();  
  for (const question of test.questions) {
    const correctOptionIndices = question.options.reduce((indices, option, index) => {
        if (option.isCorrect) indices.push(index);
        return indices;
    }, []);
    correctOptionsMap.set(question.questionIndex, correctOptionIndices);
  }
  for (const userAnswer of answers) {
    const correctOptionIndices = correctOptionsMap.get(userAnswer.questionIndex);
    if (!correctOptionIndices) continue;

    const selectedOptionIndex = userAnswer.selectedOptionIndex;
    if (correctOptionIndices.includes(selectedOptionIndex)) score++;
 }
  // Completing the Test
  await TestResults.updateOne({ _id: testResults._id }, { isCompleted: true, score });
  return score;
}

module.exports = common