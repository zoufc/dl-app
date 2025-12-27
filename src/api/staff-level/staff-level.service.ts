import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateStaffLevelDto } from './dto/create-staff-level.dto';
import { UpdateStaffLevelDto } from './dto/update-staff-level.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StaffLevel } from './interfaces/staff-level.interface';
import logger from 'src/utils/logger';

@Injectable()
export class StaffLevelService {
  constructor(
    @InjectModel('StaffLevel')
    private staffLevelModel: Model<StaffLevel>,
  ) {}

  async create(createStaffLevelDto: CreateStaffLevelDto) {
    try {
      logger.info(`---STAFF_LEVEL.SERVICE.CREATE INIT---`);
      const staffLevel = await this.staffLevelModel.create(createStaffLevelDto);
      logger.info(`---STAFF_LEVEL.SERVICE.CREATE SUCCESS---`);
      return staffLevel;
    } catch (error) {
      logger.error(`---STAFF_LEVEL.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      logger.info(`---STAFF_LEVEL.SERVICE.FIND_ALL INIT---`);
      const staffLevels = await this.staffLevelModel
        .find()
        .sort({ name: 1 })
        .exec();
      logger.info(`---STAFF_LEVEL.SERVICE.FIND_ALL SUCCESS---`);
      return staffLevels;
    } catch (error) {
      logger.error(`---STAFF_LEVEL.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---STAFF_LEVEL.SERVICE.FIND_ONE INIT---`);
      const staffLevel = await this.staffLevelModel.findById(id).exec();
      if (!staffLevel) {
        throw new HttpException(
          'Niveau de personnel non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---STAFF_LEVEL.SERVICE.FIND_ONE SUCCESS---`);
      return staffLevel;
    } catch (error) {
      logger.error(`---STAFF_LEVEL.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateStaffLevelDto: UpdateStaffLevelDto) {
    try {
      logger.info(`---STAFF_LEVEL.SERVICE.UPDATE INIT---`);
      const updated = await this.staffLevelModel
        .findByIdAndUpdate(
          id,
          { ...updateStaffLevelDto, updated_at: new Date() },
          { new: true },
        )
        .exec();
      if (!updated) {
        throw new HttpException(
          'Niveau de personnel non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---STAFF_LEVEL.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---STAFF_LEVEL.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---STAFF_LEVEL.SERVICE.REMOVE INIT---`);
      const deleted = await this.staffLevelModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException(
          'Niveau de personnel non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---STAFF_LEVEL.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---STAFF_LEVEL.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
