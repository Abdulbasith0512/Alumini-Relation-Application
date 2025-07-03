// models/alert.js
const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  user: {                                  // ✅ who should see it
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null                          // null = global/broadcast alert
  },
  title: String,                           // optional, keep if you need it
  message: { type: String, required: true },
  relatedPost: {                           // optional link to a post
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    default: null
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Alert", alertSchema);
