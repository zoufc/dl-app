import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Speciality } from './interfaces/speciality.interface';
import logger from 'src/utils/logger';

@Injectable()
export class SpecialityService {
  constructor(
    @InjectModel('Speciality') private specialityModel: Model<Speciality>,
  ) {}

  async create(createSpecialityDto: CreateSpecialityDto) {
    try {
      logger.info(`---SPECIALITY.SERVICE.CREATE INIT---`);
      const speciality = await this.specialityModel.create(createSpecialityDto);
      logger.info(`---SPECIALITY.SERVICE.CREATE SUCCESS---`);
      return speciality;
    } catch (error) {
      logger.error(`---SPECIALITY.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
  }
  }

  async findAll() {
    try {
      logger.info(`---SPECIALITY.SERVICE.FIND_ALL INIT---`);
      const specialities = await this.specialityModel.find().sort({ name: 1 }).exec();
      logger.info(`---SPECIALITY.SERVICE.FIND_ALL SUCCESS---`);
      return specialities;
    } catch (error) {
      logger.error(`---SPECIALITY.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
  }
  }

  async findOne(id: string) {
    try {
      logger.info(`---SPECIALITY.SERVICE.FIND_ONE INIT---`);
      const speciality = await this.specialityModel.findById(id).exec();
      if (!speciality) {
        throw new HttpException('Spécialité non trouvée', HttpStatus.NOT_FOUND);
      }
      logger.info(`---SPECIALITY.SERVICE.FIND_ONE SUCCESS---`);
      return speciality;
    } catch (error) {
      logger.error(`---SPECIALITY.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
  }
  }

  async update(id: string, updateSpecialityDto: UpdateSpecialityDto) {
    try {
      logger.info(`---SPECIALITY.SERVICE.UPDATE INIT---`);
      const updated = await this.specialityModel.findByIdAndUpdate(
        id,
        { ...updateSpecialityDto, updated_at: new Date() },
        { new: true }
      ).exec();
      if (!updated) {
        throw new HttpException('Spécialité non trouvée', HttpStatus.NOT_FOUND);
      }
      logger.info(`---SPECIALITY.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---SPECIALITY.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---SPECIALITY.SERVICE.REMOVE INIT---`);
      const deleted = await this.specialityModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException('Spécialité non trouvée', HttpStatus.NOT_FOUND);
      }
      logger.info(`---SPECIALITY.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---SPECIALITY.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
