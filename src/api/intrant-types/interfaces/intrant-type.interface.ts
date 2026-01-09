import { Document } from 'mongoose';

export interface IntrantType extends Document {
  name: string;
  category: any;
  description?: string;
  created_at: Date;
  updated_at: Date;
}
