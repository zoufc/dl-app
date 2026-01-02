import { Document } from 'mongoose';

export interface Supplier extends Document {
  name: string;
  description?: string;
  contactPerson?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  status: 'active' | 'inactive';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}
