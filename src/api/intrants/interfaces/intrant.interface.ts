import { Document } from 'mongoose';
import { UnitEnum } from 'src/utils/enums/unit.enum';

export interface Intrant extends Document {
  name: string;
  code: string;
  type: any;
  unit: UnitEnum;
  description?: string;
  minThreshold: number;
  created_at: Date;
  updated_at: Date;
}
