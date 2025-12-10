import { Document } from "mongoose"

export interface LabSpeciality extends Document{
    lab:string
    speciality:string
    status:string
}
