import { IsOptional } from "class-validator";

export class FindLabsDto
{
    @IsOptional()
    page?: number;

    @IsOptional()
    limit?: number;

    @IsOptional()
    structure?: string;

    @IsOptional()
    type?: string;

    @IsOptional()
    region?: string;

    @IsOptional()
    department?: string;
}