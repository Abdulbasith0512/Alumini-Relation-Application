const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
  name: String,
  enrollmentNumber: String,
  email: String,
  mobileNumber: String,
  otp: String,
  password: String,
  degree: String,
  batchYear: String,
  Profile_photo: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Register', registerSchema); // Collection will be "registers"
