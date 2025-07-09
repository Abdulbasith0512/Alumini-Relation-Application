const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true, maxlength: 500 },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value >= new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  location:    { type: String, required: true, trim: true },
  status:      { type: String, enum: ["active", "inactive"], default: "active" },
  image:       { type: String },
  enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, {
  timestamps: true
});

module.exports = mongoose.model("Event", eventSchema);
