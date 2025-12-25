import { IsNotEmpty, IsString, IsDateString, IsMongoId } from 'class-validator';

export class CreatePersonnalAssignmentDto {
  @IsNotEmpty()
  @IsMongoId()
  fromLab: string;

  @IsNotEmpty()
  @IsMongoId()
  toLab: string;

  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;
}
