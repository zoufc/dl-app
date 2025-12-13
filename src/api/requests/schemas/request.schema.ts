import * as mongoose from 'mongoose';
import { RequestTypeEnum } from 'src/utils/enums/request-type.enum';
import { RequestStatusEnum } from 'src/utils/enums/request-status.enum';

export const RequestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: Object.values(RequestTypeEnum),
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(RequestStatusEnum),
    default: RequestStatusEnum.DRAFT,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  referenceNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  submittedAt: {
    type: Date,
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

RequestSchema.index({ type: 1, status: 1 });
RequestSchema.index({ user: 1 });
RequestSchema.index({ created_at: -1 });
