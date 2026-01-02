import { IsOptional, IsMongoId } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindRequestCommentDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @IsOptional()
  @IsMongoId()
  request?: string;

  @IsOptional()
  @IsMongoId()
  author?: string;
}
