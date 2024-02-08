const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  userIPAddress: { type: String },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;