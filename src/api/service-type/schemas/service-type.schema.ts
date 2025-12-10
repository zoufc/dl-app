import mongoose from 'mongoose';
import { ServiceTypeCategory } from 'src/utils/enums/service_provider.enum';

export const ServiceTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  category: {
    type: String,
    enum: ServiceTypeCategory,
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
