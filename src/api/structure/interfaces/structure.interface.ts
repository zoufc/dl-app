import { Document } from 'mongoose';

export interface Structure extends Document {
  name: string;
  type: string;
  description: string;
  region: string;
  department: string;
  district: string;
  level: string;
  created_at: Date;
  updated_at: Date;
}
