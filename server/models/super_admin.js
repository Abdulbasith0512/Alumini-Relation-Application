const mongoose = require("mongoose");

const superAdminSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("SuperAdmin", superAdminSchema);
