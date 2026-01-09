import * as mongoose from 'mongoose';

export const IntrantCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

IntrantCategorySchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});
