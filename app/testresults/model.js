const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tests', required: true },
  isCompleted: { type: Boolean, default: false }, // Whenever the test is submited or the time completes this field will have value: true
  answers: [
    {
      questionIndex: { type: Number, required: true, index: true },
      question: { type: mongoose.Schema.Types.ObjectId, ref: 'Tests.questions' },
      selectedOptionIndex: { type: Number },
    },
  ],
  isVisited: { type: [Number] },
  isReviewed: { type: [Number] },
  score: { type: Number, default: 0 }, // +1 for correct -0.25 for negative
  submittedAt: { type: Date },
});

testResultSchema.index({ userId: 1, testId: 1})
const TestResult = mongoose.model('TestResult', testResultSchema);

module.exports = TestResult;
