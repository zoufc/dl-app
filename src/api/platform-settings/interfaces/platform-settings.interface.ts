import { Document } from 'mongoose';

export interface PlatformSettings extends Document {
  platformCommissionPercent: number;
  lenderCommissionPercent: number;
  mobileMoneyCommissionPercent: number;
  minimumTransferAmount: number;
  maximumTransferAmount: number;
  maxDailyTransfers: number;
  supportPhone: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}
