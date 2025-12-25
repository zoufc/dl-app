import { PartialType } from '@nestjs/mapped-types';
import { CreateSdrAccreditationDto } from './create-sdr-accreditation.dto';

export class UpdateSdrAccreditationDto extends PartialType(
  CreateSdrAccreditationDto,
) {}
