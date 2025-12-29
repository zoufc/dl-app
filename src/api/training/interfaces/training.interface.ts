import { Document } from 'mongoose';
import { TrainingTypeEnum } from 'src/utils/enums/training-type.enum';

export interface Training extends Document {
  title: string;
  description: string;
  user: string;
  graduationDate: Date;
  type: TrainingTypeEnum;
  institution: string;
  country: string;
  diploma?: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}
