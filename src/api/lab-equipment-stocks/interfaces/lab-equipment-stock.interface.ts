import { Document } from 'mongoose';

export interface LabEquipmentStock extends Document {
  lab: string;
  equipment: any;
  initialQuantity: number;
  remainingQuantity: number;
  usedQuantity: number;
  unit: string;
  minThreshold: number;
  order?: string;
  created_at: Date;
  updated_at: Date;
}
