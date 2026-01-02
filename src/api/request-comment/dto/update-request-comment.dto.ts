import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRequestCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}
