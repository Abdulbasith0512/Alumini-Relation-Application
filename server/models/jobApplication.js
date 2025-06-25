const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  resume: String, // file path or URL
  coverLetter: String,
  appliedAt: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" }
});

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
