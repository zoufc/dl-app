import { PartialType } from '@nestjs/mapped-types';
import { CreateIntrantCategoryDto } from './create-intrant-category.dto';

export class UpdateIntrantCategoryDto extends PartialType(
  CreateIntrantCategoryDto,
) {}
