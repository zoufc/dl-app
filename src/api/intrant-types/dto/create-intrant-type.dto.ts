import { IsNotEmpty, IsString, IsOptional, IsMongoId } from 'class-validator';

export class CreateIntrantTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  category: string;

  @IsOptional()
  @IsString()
  description?: string;
}
