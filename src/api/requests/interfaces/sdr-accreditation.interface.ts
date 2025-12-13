import { Document } from './document.interface';
import { SdrAccreditationQualificationEnum } from 'src/utils/enums/sdr-accreditation-qualification.enum';

export interface SdrAccreditation {
  companyName: string;
  companyAddress: string;
  technicalManagerName: string;
  technicalManagerEmail: string;
  technicalManagerQualification: SdrAccreditationQualificationEnum;
  companyDocuments: Document[];
  technicalManagerDocuments: Document[];
  complianceDeclaration: boolean;
}
