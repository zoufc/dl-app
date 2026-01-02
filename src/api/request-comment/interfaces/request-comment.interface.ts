import { Document } from 'mongoose';

export interface RequestComment extends Omit<Document, 'model'> {
  request: string;
  author: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}
