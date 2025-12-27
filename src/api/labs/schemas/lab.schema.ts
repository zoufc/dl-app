import * as mongoose from 'mongoose';
const autopopulate = require('mongoose-autopopulate');

export const LabSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  structure: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Structure',
    required: true,
    autopopulate: true,
  },
  specialities: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Speciality',
    default: [],
    autopopulate: true,
  },
  lat: {
    type: String,
    default: null,
  },
  lng: {
    type: String,
    default: null,
  },
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true,
    //required:true
  },
  responsible: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true,
    //required:true
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
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
LabSchema.plugin(autopopulate);
