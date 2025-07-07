const mongoose = require('mongoose');

const premiumPlanSchema = new mongoose.Schema({
  name:        { type: String, required: true },   // e.g. “Gold”
  price:       { type: Number, required: true },   // ₹ or $
  durationDays:{ type: Number, required: true },   // 30, 90 …
  description: { type: String, default: '' },      // optional
}, { timestamps: true });

module.exports = mongoose.model('PremiumPlan', premiumPlanSchema);
