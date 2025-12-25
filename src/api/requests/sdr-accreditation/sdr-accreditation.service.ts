import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from '../entities/request.entity';
import { CreateSdrAccreditationDto } from './dto/create-sdr-accreditation.dto';
import { UpdateSdrAccreditationDto } from './dto/update-sdr-accreditation.dto';
import { BaseRequestService } from '../shared/base-request.service';
import { RequestTypeEnum } from 'src/utils/enums/request-type.enum';
import {
  isCompanyField,
  isTechnicalManagerField,
} from './sdr-accreditation-file-fields.config';

@Injectable()
export class SdrAccreditationService extends BaseRequestService {
  constructor(@InjectModel('Request') requestModel: Model<Request>) {
    super(requestModel);
  }

  async create(
    dto: CreateSdrAccreditationDto,
    userId?: string | null,
    files: Express.Multer.File[] = [],
  ) {
    // Traiter les fichiers et les regrouper par catégorie
    const documentsByField = await this.processUploadedFiles(files);

    // Regrouper les fichiers dans companyDocuments et technicalManagerDocuments
    const groupedDocuments = this.groupFilesByCategory(documentsByField);

    // S'assurer que les documents regroupés sont bien fusionnés avec les données du DTO
    const finalData = {
      ...dto,
      companyDocuments: [
        ...(dto.companyDocuments || []),
        ...(groupedDocuments.companyDocuments || []),
      ],
      technicalManagerDocuments: [
        ...(dto.technicalManagerDocuments || []),
        ...(groupedDocuments.technicalManagerDocuments || []),
      ],
    };

    return this.createRequest(
      RequestTypeEnum.SDR_ACCREDITATION,
      finalData,
      userId,
      undefined, // On passe undefined car on a déjà fusionné les documents dans finalData
    );
  }

  /**
   * Regroupe les fichiers par catégorie (companyDocuments ou technicalManagerDocuments)
   * selon leur field name
   */
  private groupFilesByCategory(
    documentsByField: Record<string, any[]>,
  ): Record<string, any[]> {
    const grouped: Record<string, any[]> = {
      companyDocuments: [],
      technicalManagerDocuments: [],
    };

    for (const [fieldName, documents] of Object.entries(documentsByField)) {
      const isCompany = isCompanyField(fieldName);
      const isTechManager = isTechnicalManagerField(fieldName);

      if (isCompany) {
        grouped.companyDocuments.push(...documents);
      } else if (isTechManager) {
        grouped.technicalManagerDocuments.push(...documents);
      } else {
        // Par défaut, si le field name n'est pas reconnu, on le met dans companyDocuments
        grouped.companyDocuments.push(...documents);
      }
    }

    return grouped;
  }

  async update(id: string, dto: UpdateSdrAccreditationDto) {
    return super.update(id, {
      data: dto,
      ...(dto.status && { status: dto.status }),
    });
  }
}
