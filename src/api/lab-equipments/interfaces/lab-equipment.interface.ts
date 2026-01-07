import { Document } from 'mongoose';
import {
  LabEquipmentStatus,
  LabInventoryStatus,
} from '../schemas/lab-equipment.schema';

export interface LabEquipment extends Document {
  lab: string;
  equipment: any;
  serialNumber: string;
  modelName?: string;
  brand?: string;
  status: LabEquipmentStatus;
  inventoryStatus: LabInventoryStatus;
  warrantyExpiryDate?: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}
