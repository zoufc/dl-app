import { Document } from 'mongoose';

export interface District extends Document {
  name: string;
  region: string;
  updated_at: Date;
}
