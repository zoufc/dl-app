import { Document } from 'mongoose';

export interface Department extends Document {
  name: string;
  region: string;
  updated_at: Date;
}
