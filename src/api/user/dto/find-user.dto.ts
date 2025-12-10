import { IsOptional } from "class-validator";

export class FindUsersDto
{
    @IsOptional()
    page?: number;

    @IsOptional()
    firstname?: string;

    @IsOptional()
    lastname?: string;

    @IsOptional()
    limit?: number;

    @IsOptional()
    bloodGroup?: string;

    @IsOptional()
    email?: string;

    @IsOptional()
    lab?: string;
}