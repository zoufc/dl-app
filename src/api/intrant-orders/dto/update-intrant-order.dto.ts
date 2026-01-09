import { PartialType } from '@nestjs/mapped-types';
import { CreateIntrantOrderDto } from './create-intrant-order.dto';

export class UpdateIntrantOrderDto extends PartialType(CreateIntrantOrderDto) {}
