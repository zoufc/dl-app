import * as mongoose from 'mongoose';

export const IntrantTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IntrantCategory',
    required: true,
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

IntrantTypeSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});
