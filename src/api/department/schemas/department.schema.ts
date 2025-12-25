import * as mongoose from 'mongoose';

export const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  region: {
    type: mongoose.Schema.ObjectId,
    ref: 'Region',
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
