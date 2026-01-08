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
  affectedTo?: string;
  receivedBy?: string;
  receivedDate?: Date;
  affectedToBy?: string;
  warrantyExpiryDate?: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  notes?: string;
  createdBy?: string;
  created_at: Date;
  updated_at: Date;
}
