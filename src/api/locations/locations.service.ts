import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location } from './entities/location.entity';
import logger from 'src/utils/logger';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel('Location') private locationModel: Model<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    try {
      logger.info(`---LOCATIONS.SERVICE.CREATE INIT---`);
      const location = await this.locationModel.create(createLocationDto);
      logger.info(`---LOCATIONS.SERVICE.CREATE SUCCESS---`);
      return location;
    } catch (error) {
      logger.error(`---LOCATIONS.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      logger.info(`---LOCATIONS.SERVICE.FIND_ALL INIT---`);
      const locations = await this.locationModel
        .find()
        .sort({ name: 1 })
        .exec();
      logger.info(`---LOCATIONS.SERVICE.FIND_ALL SUCCESS---`);
      return locations;
    } catch (error) {
      logger.error(`---LOCATIONS.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---LOCATIONS.SERVICE.FIND_ONE INIT---`);
      const location = await this.locationModel.findById(id).exec();
      if (!location) {
        throw new HttpException(
          'Localisation non trouvée',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---LOCATIONS.SERVICE.FIND_ONE SUCCESS---`);
      return location;
    } catch (error) {
      logger.error(`---LOCATIONS.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    try {
      logger.info(`---LOCATIONS.SERVICE.UPDATE INIT---`);
      const updated = await this.locationModel
        .findByIdAndUpdate(
          id,
          { ...updateLocationDto, updated_at: new Date() },
          { new: true },
        )
        .exec();
      if (!updated) {
        throw new HttpException(
          'Localisation non trouvée',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---LOCATIONS.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---LOCATIONS.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---LOCATIONS.SERVICE.REMOVE INIT---`);
      const deleted = await this.locationModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException(
          'Localisation non trouvée',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---LOCATIONS.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---LOCATIONS.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
