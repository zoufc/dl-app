import { Document } from 'mongoose';
import { OtpTypeEnum } from '../schemas/otp.schema';

export interface Otp extends Document {
  user: string;
  code: string;
  type: OtpTypeEnum;
  expirationDate: Date;
  used: boolean;
  usedAt?: Date;
  created_at: Date;
  updated_at: Date;
}
