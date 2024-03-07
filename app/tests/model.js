const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    optionText: { type: String, required: true },
    optImage: { type: String },
    isCorrect: { type: Boolean, default: false },
  });
  
const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    testSections: { type: String, enum: ['R', 'QA', 'E', 'G'], required: true, default: 'R'}, // R - Reasoning, QA - Quantitative Apptitute, E - English, G - Gujarati
    queImage: { type: String },
    specialImage: { type: String },
    options: [optionSchema],
    questionIndex: { type: Number, required: true, unique: true, index: true },
});

const testSchema = new mongoose.Schema({
    testName: { type: String, required: true, unique: true }, 
    questions: [questionSchema],
    totalQuestions: { type: Number, default: 100 },
    duration: { type: Number, default: 60 }, // In Minutes
    testIndex: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], required: true, unique: true },
    readyToShow: { type: Boolean, default: true }, // ONly true for tests whos questions array length is equal to its totalQuestions Length
    testReleaseDate: { type: Date }
});

const Tests = mongoose.model('Tests', testSchema);

module.exports = Tests;