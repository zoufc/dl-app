import * as mongoose from 'mongoose'
import { LabSpecialityEnum } from 'src/utils/enums/lab.enum'

export const LabSpeciality=new mongoose.Schema({
    lab:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Lab',
        required:true
    },

    speciality:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Speciality',
        required:true
    },

    status:{
        type:String,
        enum:LabSpecialityEnum,
        default:LabSpecialityEnum.ACTIVE
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