// server/models/eventModel.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: Date,
  location: String,
  status: { type: String, default: "active" },
  image: String,

  // 👇 Add this field to track enrolled users
  enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, {
  timestamps: true
});

module.exports = mongoose.model("Event", eventSchema);
