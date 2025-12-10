import mongoose from 'mongoose';

export const PlatformSettingsSchema = new mongoose.Schema({
  platformCommissionPercent: {
    type: Number,
    required: true,
  },
  lenderCommissionPercent: {
    type: Number,
    required: true,
  },
  mobileMoneyCommissionPercent: {
    type: Number,
    required: true,
  },
  minimumTransferAmount: {
    type: Number,
    required: true,
  },
  maximumTransferAmount: {
    type: Number,
    required: true,
  },
  maxDailyTransfers: {
    type: Number,
    required: true,
  },
  supportPhone: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});
