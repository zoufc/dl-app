/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { ServiceFieldType } from 'src/utils/enums/service_offer.enum';

const ServiceFieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: ServiceFieldType.TEXT,
    enum: ServiceFieldType,
  },
  textLength: {
    type: Number,
  },

  minValue: {
    type: Number,
  },

  dropdownOptions: {
    type: {
      label: String,
      value: mongoose.Schema.Types.Mixed,
    },
    required: function () {
      return this.type === ServiceFieldType.DROPDOWN;
    },
  },
});

const ServiceProviderActionSchema = new mongoose.Schema({
  endpoint: {
    type: String,
  },
});

export const ServiceProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  serviceCode: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
    //default: '',
  },
  fields: {
    type: [ServiceFieldSchema],
    default: [],
  },
  action: {
    type: ServiceProviderActionSchema,
    default: {},
  },
  active: {
    type: Boolean,
    default: true,
  },
  created_ad: {
    type: Date,
    default: Date.now(),
  },
  updated_ad: {
    type: Date,
    default: Date.now(),
  },
});
