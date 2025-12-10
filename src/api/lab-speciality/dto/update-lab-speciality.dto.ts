import { PartialType } from '@nestjs/mapped-types';
import { CreateLabSpecialityDto } from './create-lab-speciality.dto';

export class UpdateLabSpecialityDto extends PartialType(CreateLabSpecialityDto) {}
