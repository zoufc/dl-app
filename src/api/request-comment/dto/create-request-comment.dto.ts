import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateRequestCommentDto {
  @IsNotEmpty()
  @IsMongoId()
  request: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
