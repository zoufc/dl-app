import { Document } from "mongoose";

export interface Region extends Document
{
    name:string
    code:string
}