const mongoose = require('mongoose');

const testSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    testId: { type: mongoose.Schema.ObjectId, ref: 'Tests', required: true },
    startTime: { type: Date, required: true, default: new Date() },
    endTime: { type: Date, required: true },
}, { timestamps: true })

const TestSession = mongoose.model('TestSession', testSessionSchema);


module.exports = TestSession;