import * as mongoose from 'mongoose';

export enum MaintenanceType {
  PREVENTIVE = 'preventive',
  CORRECTIVE = 'corrective',
  PREDICTIVE = 'predictive',
  CALIBRATION = 'calibration',
}

export enum MaintenanceStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  FAILED = 'failed',
}

export const MaintenanceRecordSchema = new mongoose.Schema({
  equipment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Equipment',
    required: true,
  },
  maintenanceType: {
    type: String,
    enum: Object.values(MaintenanceType),
    required: true,
  },
  technician: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: Object.values(MaintenanceStatus),
    default: MaintenanceStatus.PENDING,
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

MaintenanceRecordSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});
