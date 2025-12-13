import { RequestTypeEnum } from 'src/utils/enums/request-type.enum';
import { RequestStatusEnum } from 'src/utils/enums/request-status.enum';

export class Request {
  type: RequestTypeEnum;
  status: RequestStatusEnum;
  user?: any;
  data: any;
  referenceNumber?: string;
  submittedAt?: Date;
  created_at: Date;
  updated_at: Date;
}
