const mongoose = require('mongoose');
const testNUmber = requr

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOptionIndex: { type: Number, required: true },
});

const testSchema = new mongoose.Schema({
    testName: { type: String, required: true, unique: true },
    questions: [questionSchema],
    totalQuestions: { type: Number, default: 10 },
    testIndex: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], required: true, unique: true }
});

const Tests = mongoose.model('Tests', testSchema);

module.exports = Tests;