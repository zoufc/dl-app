/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';

export interface ServiceProvider extends Document {
  name: string;
  logo: string;
  active: boolean;
  fields: Array<any>;
  updated_at: Date;
}
