import { Document } from "mongoose";

export interface Post extends Document{
    title:string
    description:string
    author:string
    files:string[]
    eventDate:Date
    active:boolean
    deletedBy:string
    updated_at:Date
}
