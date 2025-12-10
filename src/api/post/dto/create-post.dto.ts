import { IsNotEmpty, IsOptional, ValidateIf } from "class-validator"
import { PostTypesEnum } from "src/utils/enums/post.enum";

export class CreatePostDto {
    @IsNotEmpty()
    title:string

    @IsNotEmpty()
    description:string

    @IsOptional()
    type:string

    @ValidateIf(o => o.type === PostTypesEnum.EVENT)
    @IsNotEmpty({ message: 'eventDate est requis pour les événements' })
    eventDate?: string;
}
