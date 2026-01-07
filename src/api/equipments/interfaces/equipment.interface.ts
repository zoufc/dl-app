import { Document } from 'mongoose';

export interface Equipment extends Document {
  name: string;
  description?: string;
  equipmentType?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}
