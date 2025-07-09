const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  C_reg: String,
  email: String,
  M_number: String,
  C_certificate: String,
  password: String,

  // Profile Fields
  address: String,
  batchYear: Number,
  department: String,
  Branch_Location: String,
  Membership_status: String,
  jobTitle: String,
  company: String,
  linkedin: String,
  github: String,
  bio: String,
  profilePhoto: String,

  // 🔐 Premium Subscription Info
  premium: {
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PremiumPlan',
      default: null
    },
    startDate: {
      type: Date,
      default: null
    },
    endDate: {
      type: Date,
      default: null
    }
  }

}, { timestamps: true });

/**
 * Optional: Add a method to check if user has active subscription
 */
userSchema.methods.isSubscriptionActive = function () {
  if (!this.premium || !this.premium.startDate || !this.premium.endDate) return false;
  const now = new Date();
  return this.premium.startDate <= now && this.premium.endDate >= now;
};

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
