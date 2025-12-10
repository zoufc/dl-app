/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ServiceFieldDto } from './service-fields.dto';

export class AddFieldsDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceFieldDto)
  fields: any;
}
