import { Document } from "mongoose";

export interface Structure extends Document
{
    name:string
    description:string
    regionId:string
    departmentId:string
    districtId:string
    active:boolean
}