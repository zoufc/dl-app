import mongoose from 'mongoose';
import { TrainingTypeEnum } from 'src/utils/enums/training-type.enum';

export const TrainingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  graduationDate: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: TrainingTypeEnum,
    required: true,
  },
  institution: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  diploma: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
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
