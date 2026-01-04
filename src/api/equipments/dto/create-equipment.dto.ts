import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsMongoId,
  IsNumber,
  IsEnum,
  IsDateString,
  Min,
} from 'class-validator';

export enum EquipmentStatusEnum {
  AVAILABLE = 'available',
  IN_USE = 'in_use',
  MAINTENANCE = 'maintenance',
  OUT_OF_ORDER = 'out_of_order',
  DISPOSED = 'disposed',
}

export class CreateEquipmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsMongoId()
  lab: string;

  @IsOptional()
  @IsMongoId()
  supplier?: string;

  @IsNotEmpty()
  @IsMongoId()
  equipmentType?: string;

  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  initialQuantity: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  usedQuantity?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsEnum(EquipmentStatusEnum)
  status?: EquipmentStatusEnum;

  @IsOptional()
  @IsNumber()
  @Min(0)
  purchasePrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentValue?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
