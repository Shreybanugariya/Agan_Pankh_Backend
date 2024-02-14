const common = {}
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const Tests = require('../tests/model')
const User = require('../users/model')
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
    const previousTestResult = await TestResults.findOne({ userId, testId: previousTest?._id }, { score: 1}).lean()
    if (!previousTestResult || previousTestResult.score === 0) return false
    return true
  } catch (error) {
    console.log(error);
  }
}

const calculateScore = (questions, answers) => {
  const correctOptionsMap = new Map();  
  let score = 0;
  for (const question of questions) {
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
  return score
}

common.submitTestAndCalulateResult = async ({ userId, testId }, submitedAnswers) => {
  const test = await Tests.findById(testId);
  const testResults = await TestResults.findOne({ userId, testId }).lean()
  await TestResults.updateOne({ _id: testResults._id }, { isCompleted: true, score: 0 });
  await User.updateOne({ _id: userId }, { currentTestIndex: test.testIndex + 1 })
  if (!test) return 0;
  if (submitedAnswers && submitedAnswers.length) {
    const score = calculateScore(test.questions, submitedAnswers)
    await TestResults.updateOne({ _id: testResults._id }, { isCompleted: true, score: 0 });
    return score
  } else {
    const testResults = await TestResults.findOne({ userId, testId }).lean()
    if (!testResults) return 0
    if (testResults.isCompleted) return testResults.score

    const { answers } = testResults
    if (!answers.length) return 0
    const score = calculateScore(test.questions, answers)
    await TestResults.updateOne({ _id: testResults._id }, { isCompleted: true, score: 0 });
    return score;
  }

}

module.exports = common