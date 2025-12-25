import { Document } from './document.interface';
import { LabOpeningRequestStepEnum } from 'src/utils/enums/lab-opening-request-step.enum';

export interface LabOpening {
  requestStep: LabOpeningRequestStepEnum;
  applicantName: string;
  applicantEmail: string;
  administrativeDocuments: Document[];
  technicalDocuments: Document[];
}
