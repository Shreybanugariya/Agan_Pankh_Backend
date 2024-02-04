const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tests', required: true },
  answers: [
    {
      question: { type: mongoose.Schema.Types.ObjectId, ref: 'Tests.questions' },
      selectedOptionIndex: { type: Number, required: true },
    },
  ],
  score: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
});

const TestResult = mongoose.model('TestResult', testResultSchema);

module.exports = TestResult;
