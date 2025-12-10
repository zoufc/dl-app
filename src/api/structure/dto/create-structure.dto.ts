import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateStructureDto {
    @IsNotEmpty()
    name:string

    @IsOptional()
    description:string

    @IsOptional()
    status:string

    @IsNotEmpty()
    region:string

    @IsNotEmpty()
    department:string

    @IsNotEmpty()
    district:string

    @IsOptional()
    level:string
}
