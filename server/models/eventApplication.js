const mongoose = require("mongoose");

const eventApplicationSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  appliedAt: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" } // Optional: Approved / Rejected
});

module.exports = mongoose.model("EventApplication", eventApplicationSchema);
