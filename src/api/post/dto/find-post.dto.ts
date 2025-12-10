import { IsOptional } from "class-validator";
import { PostTypesEnum } from "src/utils/enums/post.enum";

export class FindPostDto
{
    @IsOptional()
    page?: number;

    @IsOptional()
    limit?: number;

    @IsOptional()
    type?: PostTypesEnum;

    @IsOptional()
    title?: string;

    @IsOptional()
    author?: string;

    @IsOptional()
    active?: boolean;

    @IsOptional()
    upcomingEvents:boolean
}