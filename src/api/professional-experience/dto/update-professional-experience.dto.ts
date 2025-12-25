import { PartialType } from '@nestjs/mapped-types';
import { CreateProfessionalExperienceDto } from './create-professional-experience.dto';

export class UpdateProfessionalExperienceDto extends PartialType(CreateProfessionalExperienceDto) {}
