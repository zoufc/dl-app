import { Document } from 'mongoose';
export interface StaffLevel extends Document {
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}
