const mongoose = require('mongoose');
const EventEmitter = require('events');

const testSessionEmitter = new EventEmitter();

const testSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    testId: { type: mongoose.Schema.ObjectId, ref: 'Tests', required: true },
    startTime: { type: Date, required: true, default: new Date() },
    endTime: { type: Date, required: true },
})

testSessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600});
testSessionSchema.post('remove', async function (doc) {
    testSessionEmitter.emit('testSessionRemoved', { userId: doc.userId, testId: doc.testId });
})
testSessionEmitter.on('testSessionRemoved', async ({ userId, testId }) => {
    try {
        await submitTest(userId, testId);
    } catch (error) {
        console.error('Error submitting test:', error);
    }
});

const TestSession = mongoose.model('TestSession', testSessionSchema);

module.exports = TestSession;