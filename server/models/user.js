const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  C_reg: String,
  email: String,
  M_number: String,
  C_certificate: String,
  password: String,

  // New Fields
  address: String,
  batchYear: Number,
  department: String,
  jobTitle: String,
  company: String,
  linkedin: String,
  github: String,
  bio: String,
  profilePhoto: String // This can be a URL or path to the uploaded image
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
