import { Document } from 'mongoose';

export interface ServiceType extends Document {
  type: string;
  status: string;
  active: boolean;
  updated_at: Date;
}
