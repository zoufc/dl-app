import * as mongoose from "mongoose";
import { StructureLevelEnum, StructureStatusEnum } from "src/utils/enums/structure.enum";

export const StructureSchema=new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    description:{
        type:String,
    },
    status:{
        type:String,
        required:true,
        enum:StructureStatusEnum,
        default:StructureStatusEnum.PUBLIC
    },
    level:{
        type:mongoose.Schema.ObjectId,
        ref:'StructureLevel',
        default:null
    },
    region:{
        type:mongoose.Schema.ObjectId,
        ref:'Region',
        required:true
    },
    department:{
        type:mongoose.Schema.ObjectId,
        ref:'Department',
        required:true
    },
    district:{
        type:mongoose.Schema.ObjectId,
        ref:'District',
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