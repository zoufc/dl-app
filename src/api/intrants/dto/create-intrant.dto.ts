import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsMongoId,
  IsEnum,
  IsNumber,
  Min,
} from 'class-validator';
import { UnitEnum } from 'src/utils/enums/unit.enum';

export class CreateIntrantDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsMongoId()
  type: string;

  @IsNotEmpty()
  @IsEnum(UnitEnum)
  unit: UnitEnum;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minThreshold?: number;
}
