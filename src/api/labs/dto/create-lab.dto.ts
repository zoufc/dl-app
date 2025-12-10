import { IsEmail, IsNotEmpty, IsOptional } from "class-validator"

export class CreateLabDto {
    @IsNotEmpty()
    structure:string

    @IsOptional()
    lat:string

    @IsOptional()
    lng:string

    @IsNotEmpty()
    director:string

    @IsNotEmpty()
    responsible:string

    @IsNotEmpty()
    phoneNumber:string

    @IsEmail()
    email:string
}
