import { Document } from "mongoose";

export interface Lab extends Document
{
    structure:string
    lat:string
    lng:string
    director:string,
    responsible:string
    phoneNumber:string
    email:string
    updated_at:Date
}