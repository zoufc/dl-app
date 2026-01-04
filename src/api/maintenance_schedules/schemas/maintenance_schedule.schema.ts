import * as mongoose from 'mongoose';
import { MaintenanceType } from '../../maintenance_records/schemas/maintenance_record.schema';

export enum ScheduleFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export const MaintenanceScheduleSchema = new mongoose.Schema({
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
  frequency: {
    type: String,
    enum: Object.values(ScheduleFrequency),
    required: true,
  },
  lastMaintenanceDate: {
    type: Date,
  },
  nextMaintenanceDate: {
    type: Date,
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  active: {
    type: Boolean,
    default: true,
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

MaintenanceScheduleSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});
