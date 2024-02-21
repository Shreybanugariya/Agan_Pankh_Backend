const { mongoose, Schema } = require('mongoose');

const testImageSchema = new Schema({
    testId: { type: Schema.Types.ObjectId, ref: 'Tests', required: true },
    imageUrl: { type: String, required: true }
}, { timestamps: true });

const TestImage = mongoose.model('TestImage', testImageSchema);

module.exports = TestImage;
