import {
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  Min,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateLabEquipmentStockDto {
  @IsNotEmpty()
  @IsMongoId()
  lab: string;

  @IsNotEmpty()
  @IsMongoId()
  equipment: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'La quantité initiale doit être supérieure à 0' })
  initialQuantity: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  usedQuantity?: number;

  @IsNotEmpty()
  @IsString()
  unit: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  minThreshold: number;

  @IsOptional()
  @IsMongoId()
  order?: string;
}
