import * as mongoose from 'mongoose';

export const LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  lab: {
    type: mongoose.Schema.ObjectId,
    ref: 'Lab',
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
