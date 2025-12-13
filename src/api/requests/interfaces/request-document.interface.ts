import { Document } from 'mongoose';
import { RequestTypeEnum } from 'src/utils/enums/request-type.enum';
import { RequestStatusEnum } from 'src/utils/enums/request-status.enum';
import { AmmImport } from './amm-import.interface';
import { LabOpening } from './lab-opening.interface';
import { SdrAccreditation } from './sdr-accreditation.interface';

export interface RequestDocument extends Document {
  type: RequestTypeEnum;
  status: RequestStatusEnum;
  user?: any; // Optionnel car on peut créer une demande sans être connecté
  data: AmmImport | LabOpening | SdrAccreditation;
  referenceNumber?: string;
  submittedAt?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface AmmImportRequest extends RequestDocument {
  type: RequestTypeEnum.AMM_IMPORT;
  data: AmmImport;
}

export interface LabOpeningRequest extends RequestDocument {
  type: RequestTypeEnum.LAB_OPENING;
  data: LabOpening;
}

export interface SdrAccreditationRequest extends RequestDocument {
  type: RequestTypeEnum.SDR_ACCREDITATION;
  data: SdrAccreditation;
}
