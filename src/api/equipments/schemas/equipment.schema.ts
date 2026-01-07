import * as mongoose from 'mongoose';

export const EquipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  equipmentType: {
    type: mongoose.Schema.ObjectId,
    ref: 'EquipmentType',
    default: null,
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
  this.updated_at = new Date();
  next();
});
