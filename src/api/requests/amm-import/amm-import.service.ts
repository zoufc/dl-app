import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from '../entities/request.entity';
import { CreateAmmImportDto } from './dto/create-amm-import.dto';
import { UpdateAmmImportDto } from './dto/update-amm-import.dto';
import { BaseRequestService } from '../shared/base-request.service';
import { RequestTypeEnum } from 'src/utils/enums/request-type.enum';
import {
  isAdministrativeField,
  isTechnicalField,
} from './amm-import-file-fields.config';

@Injectable()
export class AmmImportService extends BaseRequestService {
  constructor(@InjectModel('Request') requestModel: Model<Request>) {
    super(requestModel);
  }

  async create(
    dto: CreateAmmImportDto,
    userId?: string | null,
    files: Express.Multer.File[] = [],
  ) {
    // Traiter les fichiers et les regrouper par catégorie
    const documentsByField = await this.processUploadedFiles(files);

    // Regrouper les fichiers dans administrativeDocuments et technicalDocuments
    const groupedDocuments = this.groupFilesByCategory(documentsByField);

    return this.createRequest(
      RequestTypeEnum.AMM_IMPORT,
      dto,
      userId,
      groupedDocuments,
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
      if (isAdministrativeField(fieldName)) {
        grouped.administrativeDocuments.push(...documents);
      } else if (isTechnicalField(fieldName)) {
        grouped.technicalDocuments.push(...documents);
      } else {
        // Par défaut, si le field name n'est pas reconnu, on le met dans administrativeDocuments
        grouped.administrativeDocuments.push(...documents);
      }
    }

    return grouped;
  }

  async update(id: string, dto: UpdateAmmImportDto) {
    return super.update(id, {
      data: dto,
      ...(dto.status && { status: dto.status }),
    });
  }
}
