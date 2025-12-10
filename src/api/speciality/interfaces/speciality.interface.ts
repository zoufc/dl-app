import { Document } from "mongoose";

export interface Speciality extends Document{
    name:string
    code:string
    description:string
    updated_at:Date
}
