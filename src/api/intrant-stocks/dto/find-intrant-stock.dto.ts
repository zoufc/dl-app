import { IsOptional, IsMongoId } from 'class-validator';

export class FindIntrantStockDto {
  @IsOptional()
  @IsMongoId()
  lab?: string;

  @IsOptional()
  @IsMongoId()
  intrant?: string;
}
