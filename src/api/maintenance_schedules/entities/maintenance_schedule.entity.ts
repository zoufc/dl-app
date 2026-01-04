import { Document } from 'mongoose';
import { MaintenanceType } from '../../maintenance_records/schemas/maintenance_record.schema';

export interface MaintenanceSchedule extends Document {
  equipment: any;
  maintenanceType: MaintenanceType;
  frequency: string;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate: Date;
  assignedTo?: any;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}
