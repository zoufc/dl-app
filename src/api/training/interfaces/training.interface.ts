import { Document } from 'mongoose';

export interface Training extends Document {
  title: string;
  description: string;
  user: string;
  graduationDate: Date;
  type: string;
  institution: string;
  country: string;
  diploma?: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}
