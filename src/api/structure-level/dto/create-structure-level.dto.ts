import { IsNotEmpty, IsOptional } from "class-validator"

export class CreateStructureLevelDto {
    @IsNotEmpty()
    name:string

    @IsNotEmpty()
    code:string

    @IsOptional()
    description:string
}
