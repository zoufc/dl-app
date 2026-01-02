import { Document } from 'mongoose';

export interface Equipment extends Omit<Document, 'model'> {
  name: string;
  description?: string;
  lab: string;
  supplier?: string;
  equipmentType?: string;
  location?: string;
  serialNumber?: string;
  model?: string;
  brand?: string;
  initialQuantity: number;
  remainingQuantity: number;
  usedQuantity: number;
  unit: string;
  purchaseDate?: Date;
  expiryDate?: Date;
  status: 'available' | 'in_use' | 'maintenance' | 'out_of_order' | 'disposed';
  purchasePrice?: number;
  currentValue?: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}
