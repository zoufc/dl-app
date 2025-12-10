import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceProviderDto } from './create-service-provider.dto';
import { IsOptional } from 'class-validator';

export class UpdateServiceProviderDto extends PartialType(
  CreateServiceProviderDto,
) {}
