import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Region } from './interfaces/region.interface';
import regions from '../../utils/seeds/regions.json';
import logger from 'src/utils/logger';

@Injectable()
export class RegionService {
  constructor(@InjectModel('Region') private regionModel: Model<Region>) {}
  async create(createRegionDto: CreateRegionDto) {
    try {
      logger.info(`---REGION.SERVICE.CREATE INIT---`);
      const region = await this.regionModel.create(createRegionDto);
      logger.info(`---REGION.SERVICE.CREATE SUCCESS---`);
      return region;
    } catch (error) {
      logger.error(`---REGION.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(error.message, error.status);
    }
  }

  async createMany() {
    try {
      logger.info(`---REGION.SERVICE.CREATE_MANY INIT---`);
      const regionSeeds = await this.regionModel.insertMany(regions);
      logger.info(`---REGION.SERVICE.CREATE_MANY SUCCESS---`);
      return regionSeeds;
    } catch (error) {
      logger.error(`---REGION.SERVICE.CREATE_MANY ERROR ${error}---`);
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll() {
    try {
      logger.info(`---REGION.SERVICE.FIND_ALL INIT---`);
      const regions = await this.regionModel.find().sort({ name: 1 }).exec();
      logger.info(`---REGION.SERVICE.FIND_ALL SUCCESS---`);
      return regions;
    } catch (error) {
      logger.error(`---REGION.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---REGION.SERVICE.FIND_ONE INIT---`);
      const region = await this.regionModel.findById(id).exec();
      if (!region) {
        throw new HttpException('Région non trouvée', HttpStatus.NOT_FOUND);
      }
      logger.info(`---REGION.SERVICE.FIND_ONE SUCCESS---`);
      return region;
    } catch (error) {
      logger.error(`---REGION.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateRegionDto: UpdateRegionDto) {
    try {
      logger.info(`---REGION.SERVICE.UPDATE INIT---`);
      const updated = await this.regionModel
        .findByIdAndUpdate(
          id,
          { ...updateRegionDto, updated_at: new Date() },
          { new: true },
        )
        .exec();
      if (!updated) {
        throw new HttpException('Région non trouvée', HttpStatus.NOT_FOUND);
      }
      logger.info(`---REGION.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---REGION.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---REGION.SERVICE.REMOVE INIT---`);
      const deleted = await this.regionModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException('Région non trouvée', HttpStatus.NOT_FOUND);
      }
      logger.info(`---REGION.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---REGION.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
