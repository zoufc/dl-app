import * as mongoose from 'mongoose'

export const DistrictSchema=new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    regionId:{
        type:mongoose.Schema.ObjectId,
        ref:'Region',
        required:true
    },
    created_at: {
    type: Date,
    default: Date.now(),
    },
    updated_at: {
        type: Date,
        default: Date.now(),
    },
})