/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateServiceProviderDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  serviceCode: string;

  @IsOptional()
  fields: any;

  @IsOptional()
  action: any;
}
