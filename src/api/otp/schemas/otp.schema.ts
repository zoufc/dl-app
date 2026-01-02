import * as mongoose from 'mongoose';

export enum OtpTypeEnum {
  PASSWORD_RESET = 'passwordReset',
  EMAIL_VERIFICATION = 'emailVerification',
  PHONE_VERIFICATION = 'phoneVerification',
}

export const OtpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: OtpTypeEnum,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  usedAt: {
    type: Date,
    default: null,
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

// Index pour faciliter la recherche
OtpSchema.index({ user: 1, type: 1, used: 1 });
OtpSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 });
