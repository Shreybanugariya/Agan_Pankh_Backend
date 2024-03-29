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
    if (testIndex === 0) return false
    const previousTest = await Tests.findOne({ userId, testIndex }, { _id: 1 }).lean()
    const previousTestResult = await TestResults.findOne({ userId, testId: previousTest?._id }, { isCompleted: 1}).lean()
    if (!previousTestResult || !previousTestResult.isCompleted) return false
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
  if (!answers.length) return score = 0
  for (const userAnswer of answers) {
    const correctOptionIndices = correctOptionsMap.get(userAnswer.questionIndex);
    if (!correctOptionIndices) continue;

    const selectedOptionIndex = userAnswer.selectedOptionIndex;
    if (correctOptionIndices.includes(selectedOptionIndex)) score++;
    else score -= 0.25
  }
  return score
}

common.submitTestAndCalulateResult = async ({ userId, testId }, submitedAnswers) => {
  const test = await Tests.findById(testId);
  const testResults = await TestResults.findOne({ userId, testId }).lean()
  await TestResults.updateOne({ _id: testResults._id }, { isCompleted: true });
  await User.updateOne({ _id: userId }, { currentTestIndex: test.testIndex + 1 })
  if (submitedAnswers && submitedAnswers.length) {
    const score = calculateScore(test.questions, submitedAnswers)
    await TestResults.updateOne({ _id: testResults._id }, { isCompleted: true, score });
    return score
  } else {
    if (!testResults) return 0
    if (testResults.isCompleted) return testResults.score

    const { answers } = testResults
    if (!answers.length) return 0
    const score = calculateScore(test.questions, answers)
    await TestResults.updateOne({ _id: testResults._id }, { isCompleted: true, score });
    return score;
  }

}

common.reCalculateResults = async () => {
  try {
    const testResults = await TestResults.find({ isCompleted: true }).lean()
    const test = await Tests.findById('65c9aca9a72789e6c210ed19');
    for (const r of testResults) {
      const score = calculateScore(test.questions, r.answers)
      await TestResults.updateOne({ _id: r._id }, { score });
      console.log('Before', r.score, 'After', score, 'of Ids', r._id);
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = common