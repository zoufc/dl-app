import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceType } from './interfaces/service-type.interface';
import logger from 'src/utils/logger';

@Injectable()
export class ServiceTypeService {
  constructor(
    @InjectModel('ServiceType') private serviceTypeModel: Model<ServiceType>,
  ) {}

  async create(createServiceTypeDto: CreateServiceTypeDto) {
    try {
      logger.info(`---SERVICE_TYPE.SERVICE.CREATE INIT---`);
      const serviceType = await this.serviceTypeModel.create(
        createServiceTypeDto,
      );
      logger.info(`---SERVICE_TYPE.SERVICE.CREATE SUCCESS---`);
      return serviceType;
    } catch (error) {
      logger.error(`---SERVICE_TYPE.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      logger.info(`---SERVICE_TYPE.SERVICE.FIND_ALL INIT---`);
      const serviceTypes = await this.serviceTypeModel.find().exec();
      logger.info(`---SERVICE_TYPE.SERVICE.FIND_ALL SUCCESS---`);
      return serviceTypes;
    } catch (error) {
      logger.error(`---SERVICE_TYPE.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---SERVICE_TYPE.SERVICE.FIND_ONE INIT---`);
      const serviceType = await this.serviceTypeModel.findById(id).exec();
      if (!serviceType) {
        throw new HttpException(
          'Type de service non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---SERVICE_TYPE.SERVICE.FIND_ONE SUCCESS---`);
      return serviceType;
    } catch (error) {
      logger.error(`---SERVICE_TYPE.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateServiceTypeDto: UpdateServiceTypeDto) {
    try {
      logger.info(`---SERVICE_TYPE.SERVICE.UPDATE INIT---`);
      const updated = await this.serviceTypeModel
        .findByIdAndUpdate(
          id,
          { ...updateServiceTypeDto, updated_at: new Date() },
          { new: true },
        )
        .exec();
      if (!updated) {
        throw new HttpException(
          'Type de service non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---SERVICE_TYPE.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---SERVICE_TYPE.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---SERVICE_TYPE.SERVICE.REMOVE INIT---`);
      const deleted = await this.serviceTypeModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException(
          'Type de service non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---SERVICE_TYPE.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---SERVICE_TYPE.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
