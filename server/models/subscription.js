const mongoose = require('mongoose');
const { Schema } = mongoose;

const subSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: Schema.Types.ObjectId, ref: 'PremiumPlan', required: true },
  start:  { type: Date, default: Date.now },
  end:    { type: Date, required: true },   // start + durationDays
  status: { type: String, enum:['active','expired','cancelled'], default:'active' },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subSchema);
