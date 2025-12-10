import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organisation } from './entities/organisation.entity';
import logger from 'src/utils/logger';

@Injectable()
export class OrganisationService {
  constructor(
    @InjectModel('Organisation') private organisationModel: Model<Organisation>,
  ) {}

  async create(createOrganisationDto: CreateOrganisationDto) {
    try {
      logger.info(`---ORGANISATION.SERVICE.CREATE INIT---`);
      const organisation = await this.organisationModel.create(
        createOrganisationDto,
      );
      logger.info(`---ORGANISATION.SERVICE.CREATE SUCCESS---`);
      return organisation;
    } catch (error) {
      logger.error(`---ORGANISATION.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      logger.info(`---ORGANISATION.SERVICE.FIND_ALL INIT---`);
      const organisations = await this.organisationModel
        .find()
        .sort({ name: 1 })
        .exec();
      logger.info(`---ORGANISATION.SERVICE.FIND_ALL SUCCESS---`);
      return organisations;
    } catch (error) {
      logger.error(`---ORGANISATION.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---ORGANISATION.SERVICE.FIND_ONE INIT---`);
      const organisation = await this.organisationModel.findById(id).exec();
      if (!organisation) {
        throw new HttpException(
          'Organisation non trouvée',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---ORGANISATION.SERVICE.FIND_ONE SUCCESS---`);
      return organisation;
    } catch (error) {
      logger.error(`---ORGANISATION.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateOrganisationDto: UpdateOrganisationDto) {
    try {
      logger.info(`---ORGANISATION.SERVICE.UPDATE INIT---`);
      const updated = await this.organisationModel
        .findByIdAndUpdate(
          id,
          { ...updateOrganisationDto, updated_at: new Date() },
          { new: true },
        )
        .exec();
      if (!updated) {
        throw new HttpException(
          'Organisation non trouvée',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---ORGANISATION.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---ORGANISATION.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---ORGANISATION.SERVICE.REMOVE INIT---`);
      const deleted = await this.organisationModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException(
          'Organisation non trouvée',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---ORGANISATION.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---ORGANISATION.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
