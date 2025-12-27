import { IsOptional, IsArray, IsMongoId } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindUsersDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @IsOptional()
  firstname?: string;

  @IsOptional()
  lastname?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @IsOptional()
  bloodGroup?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  search?: string;

  @IsOptional()
  @IsMongoId()
  lab?: string;

  @IsOptional()
  @IsMongoId()
  level?: string;

  @IsOptional()
  @Transform(({ value }) => {
    // Si c'est déjà un tableau, le retourner tel quel
    if (Array.isArray(value)) {
      return value;
    }
    // Si c'est une string, la transformer en tableau
    if (typeof value === 'string') {
      return value.split(',').map((id) => id.trim());
    }
    return value;
  })
  @IsArray()
  @IsMongoId({ each: true })
  specialities?: string[];
}
