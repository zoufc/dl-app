import * as mongoose from 'mongoose'

export const StructureLevelSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    code:{
        type:String,
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