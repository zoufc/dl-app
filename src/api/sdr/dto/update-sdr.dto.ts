import { PartialType } from '@nestjs/mapped-types';
import { CreateSdrDto } from './create-sdr.dto';

export class UpdateSdrDto extends PartialType(CreateSdrDto) {}
