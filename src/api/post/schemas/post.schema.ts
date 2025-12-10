import * as mongoose from 'mongoose' 
import { PostTypesEnum } from 'src/utils/enums/post.enum'

export const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    type:{
        type:String,
        enum:PostTypesEnum,
        default:PostTypesEnum.NEWS
    },
    files:{
        type:[String],
        default:[]
    },
    eventDate:{
        type:Date,
        default:null
    },
    active:{
        type:Boolean,
        default:true
    },
    deletedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    updated_at:{
        type:Date
    }
})