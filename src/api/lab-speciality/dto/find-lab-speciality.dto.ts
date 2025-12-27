import { IsOptional, IsMongoId, IsString } from 'class-validator';

export class FindLabSpecialityDto {
  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsMongoId()
  lab?: string;

  @IsOptional()
  @IsMongoId()
  speciality?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
