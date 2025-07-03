// models/gallery.js
const mongoose = require('mongoose');

/* a single image / video */
const mediaSchema = new mongoose.Schema({
  url:  { type: String, required: true },             // absolute path
  type: { type: String, enum: ['image', 'video'], required: true },
});

const gallerySchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 250 },
    media:       [mediaSchema],                       // array of images / videos
  },
  { timestamps: true }                                // createdAt / updatedAt
);

module.exports = mongoose.model('Gallery', gallerySchema);
