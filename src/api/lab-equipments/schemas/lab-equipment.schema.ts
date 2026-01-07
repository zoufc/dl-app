import * as mongoose from 'mongoose';

export enum LabEquipmentStatus {
  OPERATIONAL = 'operational',
  BROKEN = 'broken',
  MAINTENANCE = 'maintenance',
  OUT_OF_ORDER = 'out_of_order',
}

export enum LabInventoryStatus {
  AVAILABLE = 'available',
  IN_USE = 'in_use',
  RETIRED = 'retired',
}

export const LabEquipmentSchema = new mongoose.Schema({
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
  serialNumber: {
    type: String,
    unique: true,
    required: true,
  },
  modelName: {
    type: String,
  },
  brand: {
    type: String,
  },
  status: {
    type: String,
    enum: Object.values(LabEquipmentStatus),
    default: LabEquipmentStatus.OPERATIONAL,
  },
  inventoryStatus: {
    type: String,
    enum: Object.values(LabInventoryStatus),
    default: LabInventoryStatus.AVAILABLE,
  },
  purchaseDate: {
    type: Date,
  },
  warrantyExpiryDate: {
    type: Date,
  },
  lastMaintenanceDate: {
    type: Date,
  },
  nextMaintenanceDate: {
    type: Date,
  },
  notes: {
    type: String,
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

LabEquipmentSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});
