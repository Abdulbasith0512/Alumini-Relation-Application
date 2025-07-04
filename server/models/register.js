// server/models/Register.js
const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
  // keep your known fields for clarity ...
  name: String,
  enrollmentNumber: String,
  email: String,
  mobileNumber: String,
  otp: String,
  password: String,
  degree: String,
  batchYear: String,
  Profile_photo: String,

  // any new fields the super‑admin creates will flow in automatically
}, {
  timestamps: true,
  strict: false            // <‑‑ IMPORTANT: lets unknown keys be saved
});

module.exports = mongoose.model('Register', registerSchema);
