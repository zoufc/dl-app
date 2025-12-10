import * as mongoose from 'mongoose'

export const RegionSchema=new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    code:{
        type:String,
        unique:true,
        required:true
    }
})