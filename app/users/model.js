const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  username: { type: String },
  email: { type: String, required: true, unique: true },
  contactNo: { type: Number, unique: true, maxLength: 10 },
  password: { type: String, required: false }, // Required For Admin
  isAdmin: { type: Boolean, default: false },
  preminum: { type: Boolean, default: false },
  authToken: { type: String },
  currentTestIndex: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], required: true, unique: true, default: 0 },
  city: { type: String },
  isActive: { type: Boolean, default: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;