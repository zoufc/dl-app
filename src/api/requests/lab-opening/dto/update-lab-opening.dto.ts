import { PartialType } from '@nestjs/mapped-types';
import { CreateLabOpeningDto } from './create-lab-opening.dto';

export class UpdateLabOpeningDto extends PartialType(CreateLabOpeningDto) {}
