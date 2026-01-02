import * as mongoose from 'mongoose';

export const RequestCommentSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.ObjectId,
    ref: 'Request',
    required: true,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});

// Index pour faciliter la recherche
RequestCommentSchema.index({ request: 1, created_at: -1 });
RequestCommentSchema.index({ author: 1 });

RequestCommentSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});
