import { IsNotEmpty, IsOptional } from "class-validator"

export class CreateSpecialityDto {
    @IsNotEmpty()
    name:string

    @IsNotEmpty()
    code:string

    @IsOptional()
    description:string
}
