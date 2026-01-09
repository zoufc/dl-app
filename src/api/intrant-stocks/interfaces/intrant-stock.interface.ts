import { Document } from 'mongoose';
import { UnitEnum } from 'src/utils/enums/unit.enum';

export interface IntrantStock extends Document {
  lab: any;
  intrant: any;
  initialQuantity: number;
  usedQuantity: number;
  remainingQuantity: number;
  unit: UnitEnum;
  minThreshold: number;
  expiryDate?: Date;
  batchNumber?: string;
  created_at: Date;
  updated_at: Date;
}
