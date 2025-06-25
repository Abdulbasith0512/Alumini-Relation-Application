const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: String,
  location: String,
  jobType: String, // e.g., Full-time, Internship, Remote
  description: String,
  postedAt: { type: Date, default: Date.now },
  image: String, // optional company logo
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("Job", jobSchema);
