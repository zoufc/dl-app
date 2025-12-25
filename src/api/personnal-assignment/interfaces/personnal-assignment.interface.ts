import { Document } from 'mongoose';

export interface PersonnalAssignment extends Document {
  fromLab: string;
  toLab: string;
  user: string;
  reason: string;
  startDate: Date;
  endDate: Date;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}
