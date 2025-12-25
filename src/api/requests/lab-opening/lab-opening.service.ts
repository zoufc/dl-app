import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from '../entities/request.entity';
import { CreateLabOpeningDto } from './dto/create-lab-opening.dto';
import { UpdateLabOpeningDto } from './dto/update-lab-opening.dto';
import { BaseRequestService } from '../shared/base-request.service';
import { RequestTypeEnum } from 'src/utils/enums/request-type.enum';
import {
  isAdministrativeField,
  isTechnicalField,
} from './lab-opening-file-fields.config';

@Injectable()
export class LabOpeningService extends BaseRequestService {
  constructor(@InjectModel('Request') requestModel: Model<Request>) {
    super(requestModel);
  }

  async create(
    dto: CreateLabOpeningDto,
    userId?: string | null,
    files: Express.Multer.File[] = [],
  ) {
    // Traiter les fichiers et les regrouper par catégorie
    const documentsByField = await this.processUploadedFiles(files);

    // Regrouper les fichiers dans administrativeDocuments et technicalDocuments
    const groupedDocuments = this.groupFilesByCategory(documentsByField);

    // S'assurer que les documents regroupés sont bien fusionnés avec les données du DTO
    const finalData = {
      ...dto,
      administrativeDocuments: [
        ...(dto.administrativeDocuments || []),
        ...(groupedDocuments.administrativeDocuments || []),
      ],
      technicalDocuments: [
        ...(dto.technicalDocuments || []),
        ...(groupedDocuments.technicalDocuments || []),
      ],
    };

    return this.createRequest(
      RequestTypeEnum.LAB_OPENING,
      finalData,
      userId,
      undefined, // On passe undefined car on a déjà fusionné les documents dans finalData
    );
  }

  /**
   * Regroupe les fichiers par catégorie (administrativeDocuments ou technicalDocuments)
   * selon leur field name
   */
  private groupFilesByCategory(
    documentsByField: Record<string, any[]>,
  ): Record<string, any[]> {
    const grouped: Record<string, any[]> = {
      administrativeDocuments: [],
      technicalDocuments: [],
    };

    for (const [fieldName, documents] of Object.entries(documentsByField)) {
      const isAdmin = isAdministrativeField(fieldName);
      const isTech = isTechnicalField(fieldName);

      if (isAdmin) {
        grouped.administrativeDocuments.push(...documents);
      } else if (isTech) {
        grouped.technicalDocuments.push(...documents);
      } else {
        // Par défaut, si le field name n'est pas reconnu, on le met dans administrativeDocuments
        grouped.administrativeDocuments.push(...documents);
      }
    }

    return grouped;
  }

  async update(id: string, dto: UpdateLabOpeningDto) {
    return super.update(id, {
      data: dto,
      ...(dto.status && { status: dto.status }),
    });
  }
}
