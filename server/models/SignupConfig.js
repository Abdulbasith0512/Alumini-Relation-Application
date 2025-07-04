const mongoose = require('mongoose');

const customFieldSchema = new mongoose.Schema({
  key: String,
  label: String,
  type: { type: String, default: 'text' },
  required: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },
});

const signupConfigSchema = new mongoose.Schema({
  visibleFields: {
    name: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    password: { type: Boolean, default: true },
    mobileNumber: { type: Boolean, default: true },
    enrollmentNumber: { type: Boolean, default: true },
    batchYear: { type: Boolean, default: true },
    degree: { type: Boolean, default: true },
    Profile_photo: { type: Boolean, default: true },
  },
  customFields: [customFieldSchema],
});

module.exports = mongoose.model('SignupConfig', signupConfigSchema);
