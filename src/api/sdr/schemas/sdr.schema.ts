import * as mongoose from 'mongoose';

export const SdrSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  registrationNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  description: {
    type: String,
    required: false,
  },
  admin: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false,
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

// Index pour faciliter la recherche
SdrSchema.index({ name: 1 });
SdrSchema.index({ city: 1 });
SdrSchema.index({ active: 1 });

SdrSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});
