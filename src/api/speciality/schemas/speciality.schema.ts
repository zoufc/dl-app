import * as mongoose from 'mongoose'

export const SpecialitySchema=new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },

    code:{
        type:String,
        unique:true,
        required:true
    },

    description:{
        type:String,
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