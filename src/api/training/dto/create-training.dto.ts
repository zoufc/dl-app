import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import { TrainingTypeEnum } from 'src/utils/enums/training-type.enum';

export class CreateTrainingDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsMongoId()
  user?: string;

  @IsNotEmpty()
  @IsDateString()
  graduationDate: Date;

  @IsNotEmpty()
  @IsEnum(TrainingTypeEnum)
  type: TrainingTypeEnum;

  @IsNotEmpty()
  @IsString()
  institution: string;

  @IsNotEmpty()
  @IsString()
  country: string;
}
