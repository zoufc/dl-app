import { Document } from 'mongoose';
import { MaintenanceType } from '../schemas/maintenance_record.schema';

export interface MaintenanceRecord extends Document {
  equipment: any;
  maintenanceType: MaintenanceType;
  technician: any;
  date: Date;
  description: string;
  cost: number;
  status: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}
