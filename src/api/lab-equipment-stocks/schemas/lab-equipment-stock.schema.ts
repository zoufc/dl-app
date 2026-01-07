import * as mongoose from 'mongoose';
import { UnitEnum } from 'src/utils/enums/unit.enum';

export const LabEquipmentStockSchema = new mongoose.Schema({
  lab: {
    type: mongoose.Schema.ObjectId,
    ref: 'Lab',
    required: true,
  },
  equipment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Equipment',
    required: true,
  },
  initialQuantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  remainingQuantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  usedQuantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  unit: {
    type: String,
    enum: Object.values(UnitEnum),
    default: UnitEnum.UNIT,
  },
  minThreshold: {
    type: Number,
    required: true,
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'EquipmentOrder',
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

LabEquipmentStockSchema.index({ lab: 1, equipment: 1 }, { unique: true });

// Hook pour calculer remainingQuantity automatiquement
LabEquipmentStockSchema.pre('save', function (next) {
  if (
    this.isNew ||
    this.isModified('initialQuantity') ||
    this.isModified('usedQuantity')
  ) {
    this.remainingQuantity = this.initialQuantity - (this.usedQuantity || 0);
    if (this.remainingQuantity < 0) {
      this.remainingQuantity = 0;
    }
  }
  this.updated_at = new Date();
  next();
});
