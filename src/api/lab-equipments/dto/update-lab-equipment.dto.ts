import { PartialType } from '@nestjs/mapped-types';
import { CreateLabEquipmentDto } from './create-lab-equipment.dto';
import { IsOptional } from 'class-validator';
import { IsMongoId } from 'class-validator';
import { IsDateString } from 'class-validator';

export class UpdateLabEquipmentDto extends PartialType(CreateLabEquipmentDto) {
  @IsOptional()
  @IsMongoId()
  affectedTo?: string;

  @IsOptional()
  @IsMongoId()
  receivedBy?: string;

  @IsOptional()
  @IsDateString()
  receivedDate?: Date;

  @IsOptional()
  @IsMongoId()
  affectedToBy?: string;
}
