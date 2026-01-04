import * as mongoose from 'mongoose';
import { EquipmentStatusEnum } from '../dto/create-equipment.dto';

export const EquipmentSchema = new mongoose.Schema({
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
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: 'Supplier',
    //default: null,
  },
  equipmentType: {
    type: mongoose.Schema.ObjectId,
    ref: 'EquipmentType',
    default: null,
  },
  serialNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  model: {
    type: String,
  },
  brand: {
    type: String,
  },
  // Quantités
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
    default: 0,
    min: 0,
  },
  unit: {
    type: String,
    default: 'unité',
  },
  // Dates
  purchaseDate: {
    type: Date,
  },
  expiryDate: {
    type: Date,
  },
  // Statut
  status: {
    type: String,
    enum: EquipmentStatusEnum,
    default: EquipmentStatusEnum.AVAILABLE,
  },
  // Informations supplémentaires
  purchasePrice: {
    type: Number,
    min: 0,
  },
  currentValue: {
    type: Number,
    min: 0,
  },
  notes: {
    type: String,
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

// Hook pour calculer remainingQuantity automatiquement
EquipmentSchema.pre('save', function (next) {
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
