import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateMaintenanceScheduleDto } from './dto/create-maintenance_schedule.dto';
import { UpdateMaintenanceScheduleDto } from './dto/update-maintenance_schedule.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MaintenanceSchedule } from './entities/maintenance_schedule.entity';
import logger from 'src/utils/logger';

@Injectable()
export class MaintenanceSchedulesService {
  constructor(
    @InjectModel('MaintenanceSchedule')
    private maintenanceScheduleModel: Model<MaintenanceSchedule>,
  ) {}

  async create(createMaintenanceScheduleDto: CreateMaintenanceScheduleDto) {
    try {
      logger.info(`---MAINTENANCE_SCHEDULES.SERVICE.CREATE INIT---`);
      const maintenanceSchedule = await this.maintenanceScheduleModel.create(
        createMaintenanceScheduleDto,
      );
      await maintenanceSchedule.populate('equipment', 'name serialNumber');
      logger.info(`---MAINTENANCE_SCHEDULES.SERVICE.CREATE SUCCESS---`);
      return maintenanceSchedule;
    } catch (error) {
      logger.error(`---MAINTENANCE_SCHEDULES.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      logger.info(`---MAINTENANCE_SCHEDULES.SERVICE.FIND_ALL INIT---`);
      const maintenanceSchedules = await this.maintenanceScheduleModel
        .find()
        .populate('equipment', 'name serialNumber')
        .sort({ nextMaintenanceDate: 1 })
        .exec();
      logger.info(`---MAINTENANCE_SCHEDULES.SERVICE.FIND_ALL SUCCESS---`);
      return maintenanceSchedules;
    } catch (error) {
      logger.error(
        `---MAINTENANCE_SCHEDULES.SERVICE.FIND_ALL ERROR ${error}---`,
      );
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---MAINTENANCE_SCHEDULES.SERVICE.FIND_ONE INIT---`);
      const maintenanceSchedule = await this.maintenanceScheduleModel
        .findById(id)
        .populate('equipment', 'name serialNumber')
        .exec();
      if (!maintenanceSchedule) {
        throw new HttpException(
          'Planning de maintenance non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---MAINTENANCE_SCHEDULES.SERVICE.FIND_ONE SUCCESS---`);
      return maintenanceSchedule;
    } catch (error) {
      logger.error(
        `---MAINTENANCE_SCHEDULES.SERVICE.FIND_ONE ERROR ${error}---`,
      );
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateMaintenanceScheduleDto: UpdateMaintenanceScheduleDto,
  ) {
    try {
      logger.info(`---MAINTENANCE_SCHEDULES.SERVICE.UPDATE INIT---`);
      const updated = await this.maintenanceScheduleModel
        .findByIdAndUpdate(
          id,
          { ...updateMaintenanceScheduleDto, updated_at: new Date() },
          { new: true },
        )
        .populate('equipment', 'name serialNumber')
        .exec();
      if (!updated) {
        throw new HttpException(
          'Planning de maintenance non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---MAINTENANCE_SCHEDULES.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---MAINTENANCE_SCHEDULES.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---MAINTENANCE_SCHEDULES.SERVICE.REMOVE INIT---`);
      const deleted = await this.maintenanceScheduleModel
        .findByIdAndDelete(id)
        .exec();
      if (!deleted) {
        throw new HttpException(
          'Planning de maintenance non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---MAINTENANCE_SCHEDULES.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---MAINTENANCE_SCHEDULES.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
