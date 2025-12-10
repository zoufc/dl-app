import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { District } from './interfaces/district.interface';
import districts from '../../utils/seeds/district.json'
import logger from 'src/utils/logger';

@Injectable()
export class DistrictService {
  constructor(@InjectModel('District') private districtModel:Model<District>){}
  
  async create(createDistrictDto: CreateDistrictDto) {
    try {
      logger.info(`---DISTRICT.SERVICE.CREATE INIT---`);
      const district=await this.districtModel.create(createDistrictDto)
      logger.info(`---DISTRICT.SERVICE.CREATE SUCCESS---`);
      return district
    } catch (error) {
      logger.error(`---DISTRICT.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(error.message,error.status)
    }
  }

  async createMany(){
    try {
      logger.info(`---DISTRICT.SERVICE.CREATE_MANY INIT---`);
      const districtSeeds=await this.districtModel.insertMany(districts)
      logger.info(`---DISTRICT.SERVICE.CREATE_MANY SUCCESS---`);
      return districtSeeds;
    } catch (error) {
      logger.error(`---DISTRICT.SERVICE.CREATE_MANY ERROR ${error}---`);
      throw new HttpException(error.message,error.status)
    }
  }

  async findAll() {
    try {
      logger.info(`---DISTRICT.SERVICE.FIND_ALL INIT---`);
      const districts = await this.districtModel.find().sort({ name: 1 }).exec();
      logger.info(`---DISTRICT.SERVICE.FIND_ALL SUCCESS---`);
      return districts;
    } catch (error) {
      logger.error(`---DISTRICT.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---DISTRICT.SERVICE.FIND_ONE INIT---`);
      const district = await this.districtModel.findById(id).exec();
      if (!district) {
        throw new HttpException('District non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---DISTRICT.SERVICE.FIND_ONE SUCCESS---`);
      return district;
    } catch (error) {
      logger.error(`---DISTRICT.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateDistrictDto: UpdateDistrictDto) {
    try {
      logger.info(`---DISTRICT.SERVICE.UPDATE INIT---`);
      const updated = await this.districtModel.findByIdAndUpdate(
        id,
        { ...updateDistrictDto, updated_at: new Date() },
        { new: true }
      ).exec();
      if (!updated) {
        throw new HttpException('District non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---DISTRICT.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---DISTRICT.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---DISTRICT.SERVICE.REMOVE INIT---`);
      const deleted = await this.districtModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException('District non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---DISTRICT.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---DISTRICT.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
