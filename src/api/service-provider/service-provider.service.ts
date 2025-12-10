/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateServiceProviderDto } from './dto/create-service-provider.dto';
import { UpdateServiceProviderDto } from './dto/update-service-provider.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceProvider } from './interfaces/service-provider.interface';
import logger from 'src/utils/logger';
import { uploadFile } from 'src/utils/functions/file.upload';
import { AddFieldsDto } from './dto/add-fields.dto';

@Injectable()
export class ServiceProviderService {
  constructor(
    @InjectModel('ServiceProvider')
    private serviceProviderModel: Model<ServiceProvider>,
  ) {}
  async create(
    createServiceProviderDto: CreateServiceProviderDto,
    logo: Express.Multer.File,
  ) {
    try {
      logger.info(`---SERVICE_PROVIDER.SERVICE.CREATE INIT---`);
      const findByName = await this.findByName(createServiceProviderDto.name);
      if (findByName) {
        throw new HttpException(
          'Third party already exists',
          HttpStatus.CONFLICT,
        );
      }
      let thirdParty = new this.serviceProviderModel(createServiceProviderDto);
      const logoUrl = await uploadFile(logo);
      thirdParty.logo = logoUrl;
      logger.info(`---SERVICE_PROVIDER.SERVICE.CREATE SUCCESS---`);
      return await thirdParty.save();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findByName(name: string) {
    try {
      return await this.serviceProviderModel.findOne({ name });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll() {
    try {
      logger.info(`---SERVICE_PROVIDER.SERVICE.FIND_ALL INIT---`);
      const thirdParties = await this.serviceProviderModel.find().exec();
      logger.info(`---SERVICE_PROVIDER.SERVICE.CREATE SUCCESS---`);
      return thirdParties;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---SERVICE_PROVIDER.SERVICE.FIND_ONE INIT---`);
      const serviceProvider = await this.serviceProviderModel
        .findById(id)
        .exec();
      if (!serviceProvider) {
        throw new HttpException(
          'Service provider non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---SERVICE_PROVIDER.SERVICE.FIND_ONE SUCCESS---`);
      return serviceProvider;
    } catch (error) {
      logger.error(`---SERVICE_PROVIDER.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateServiceProviderDto: UpdateServiceProviderDto) {
    try {
      const updated = await this.serviceProviderModel.findByIdAndUpdate(
        id,
        updateServiceProviderDto,
        { new: true },
      );
      return updated;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async addFields(id: string, addFieldsDto: AddFieldsDto) {
    try {
      const provider = await this.serviceProviderModel.findById(id);
      if (!provider) {
        throw new HttpException('Service provider not found', 404);
      }

      const existingNames = new Set(provider.fields.map((f) => f.name));

      // 3. Vérifier les doublons
      const duplicates = addFieldsDto.fields.filter((f) =>
        existingNames.has(f.name),
      );

      if (duplicates.length > 0) {
        const names = duplicates.map((d) => `"${d.name}"`).join(', ');
        throw new HttpException(
          `Les champs suivants existent déjà : ${names}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      provider.fields.push(...addFieldsDto.fields);
      await provider.save();

      return provider;
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---SERVICE_PROVIDER.SERVICE.REMOVE INIT---`);
      const deleted = await this.serviceProviderModel
        .findByIdAndDelete(id)
        .exec();
      if (!deleted) {
        throw new HttpException(
          'Service provider non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---SERVICE_PROVIDER.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---SERVICE_PROVIDER.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
