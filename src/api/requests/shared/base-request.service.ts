import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from '../entities/request.entity';
import { Document } from '../interfaces/document.interface';
import { uploadFile } from 'src/utils/functions/file.upload';
import { RequestStatusEnum } from 'src/utils/enums/request-status.enum';

@Injectable()
export abstract class BaseRequestService {
  constructor(@InjectModel('Request') protected requestModel: Model<Request>) {}

  protected async processUploadedFiles(
    files: Express.Multer.File[],
  ): Promise<Record<string, Document[]>> {
    if (!files?.length) return {};

    const filesByField = files.reduce((acc, file) => {
      if (!acc[file.fieldname]) acc[file.fieldname] = [];
      acc[file.fieldname].push(file);
      return acc;
    }, {} as Record<string, Express.Multer.File[]>);

    const documentsByField: Record<string, Document[]> = {};

    for (const [fieldName, fieldFiles] of Object.entries(filesByField)) {
      documentsByField[fieldName] = await Promise.all(
        fieldFiles.map(async (file) => ({
          name: file.fieldname,
          url: await uploadFile(file),
        })),
      );
    }

    return documentsByField;
  }

  protected async createRequest(
    type: string,
    data: any,
    userId?: string | null,
    documentsByField?: Record<string, Document[]>,
  ) {
    const mergedData = { ...data };
    if (documentsByField) {
      for (const fieldName of Object.keys(documentsByField)) {
        mergedData[fieldName] = [
          ...(data[fieldName] || []),
          ...(documentsByField[fieldName] || []),
        ];
      }
    }

    const requestData: any = {
      type,
      status: data.status || RequestStatusEnum.DRAFT,
      data: mergedData,
    };

    if (userId) requestData.user = userId;

    const request = await this.requestModel.create(requestData);
    if (userId) await request.populate('user', 'firstname lastname email');
    return request;
  }

  async findOne(id: string) {
    const request = await this.requestModel
      .findById(id)
      .populate('user', 'firstname lastname email')
      .exec();
    if (!request) {
      throw new HttpException('Demande non trouvée', HttpStatus.NOT_FOUND);
    }
    return request;
  }

  async findAll(type?: string) {
    const query = type ? { type } : {};
    return this.requestModel
      .find(query)
      .populate('user', 'firstname lastname email')
      .sort({ created_at: -1 })
      .exec();
  }

  async update(id: string, updateData: any) {
    const updated = await this.requestModel
      .findByIdAndUpdate(
        id,
        { ...updateData, updated_at: new Date() },
        { new: true },
      )
      .populate('user', 'firstname lastname email')
      .exec();
    if (!updated) {
      throw new HttpException('Demande non trouvée', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.requestModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new HttpException('Demande non trouvée', HttpStatus.NOT_FOUND);
    }
    return deleted;
  }
}
