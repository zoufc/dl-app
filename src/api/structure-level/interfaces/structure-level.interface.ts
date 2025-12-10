import { Document } from "mongoose";

export interface StructureLevel extends Document{
    name:string
    code:string
    description:string
}
