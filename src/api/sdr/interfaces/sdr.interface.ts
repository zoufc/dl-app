import { Document } from 'mongoose';

export interface Sdr extends Document {
  name: string;
  address?: string;
  city?: string;
  phoneNumber?: string;
  email?: string;
  registrationNumber?: string;
  description?: string;
  admin?: any;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}
