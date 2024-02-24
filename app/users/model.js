const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  username: { type: String },
  email: { type: String, required: true, unique: true },
  contactNo: { type: Number, maxLength: 10 },
  password: { type: String, required: false }, // Required For Admin
  isAdmin: { type: Boolean, default: false },
  hasPreminum: { type: Boolean, default: false },
  authToken: { type: String },
  currentTestIndex: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], required: true, default: 0 },
  city: { type: String },
  isActive: { type: Boolean, default: true },
  promoCode: { type: String },
});

const User = mongoose.model('User', userSchema);

module.exports = User;