const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    authorId: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const DiscussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 140,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 4000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 30,
      },
    ],
    authorId: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    likes: [
      {
        type: String,
      },
    ],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Discussion', DiscussionSchema);