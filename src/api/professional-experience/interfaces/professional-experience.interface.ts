import { Document } from 'mongoose';

export interface ProfessionalExperience extends Document {
  user: string;
  companyName: string;
  serviceCertificateFile?: string;
  position: string;
  startDate: Date;
  endDate: Date;
  description: string;
  created_at: Date;
  updated_at: Date;
}
