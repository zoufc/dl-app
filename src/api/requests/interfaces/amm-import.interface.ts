import { Document } from './document.interface';
import { AmmImportRequestTypeEnum } from 'src/utils/enums/amm-import-request-type.enum';

export interface AmmImport {
  applicantName: string;
  applicantEmail: string;
  companyName: string;
  reagentName: string;
  requestType: AmmImportRequestTypeEnum;
  description: string;
  administrativeDocuments: Document[];
  technicalDocuments: Document[];
  complianceAttestation: boolean;
}
