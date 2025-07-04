// models/Application.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  applicant: {                       // ← NEW: links to User._id
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  job: {                             // Job the user applied for
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  name:  { type: String, required: true },
  email: { type: String, required: true },
  resume:{ type: String, required: true },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Application", applicationSchema);
