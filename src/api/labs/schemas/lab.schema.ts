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

// Cascade delete related documents when a lab is deleted
LabSchema.pre(
  ['findOneAndDelete', 'deleteOne'],
  { query: true, document: false },
  async function (next) {
    try {
      const query = this.getQuery();
      const labId = query._id;

      if (labId) {
        const mongoose = require('mongoose');

        // Delete related LabEquipments
        await mongoose.model('LabEquipment').deleteMany({ lab: labId });

        // Delete related EquipmentOrders
        await mongoose.model('EquipmentOrder').deleteMany({ lab: labId });

        // Delete related LabEquipmentStocks
        await mongoose.model('LabEquipmentStock').deleteMany({ lab: labId });

        // Delete related Users (staff)
        await mongoose.model('User').deleteMany({ lab: labId });
      }
      next();
    } catch (error) {
      next(error);
    }
  },
);
