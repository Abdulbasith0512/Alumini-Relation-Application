const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Poster
  photo: { type: String }, // Filename or URL
  bio: { type: String, required: true }, // Caption or description

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // References users who liked
    }
  ],

  comments: [commentSchema], // Embedded subdocuments

  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
