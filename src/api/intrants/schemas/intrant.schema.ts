import * as mongoose from 'mongoose';
import { UnitEnum } from 'src/utils/enums/unit.enum';

export const IntrantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IntrantType',
    required: true,
  },
  unit: {
    type: String,
    enum: Object.values(UnitEnum),
    required: true,
    default: UnitEnum.UNIT,
  },
  description: {
    type: String,
    default: null,
  },
  minThreshold: {
    type: Number,
    default: 0,
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

IntrantSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});
