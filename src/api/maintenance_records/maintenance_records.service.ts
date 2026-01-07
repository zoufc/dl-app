import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateMaintenanceRecordDto } from './dto/create-maintenance_record.dto';
import { UpdateMaintenanceRecordDto } from './dto/update-maintenance_record.dto';
import { FindMaintenanceRecordDto } from './dto/find-maintenance_record.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MaintenanceRecord } from './entities/maintenance_record.entity';
import logger from 'src/utils/logger';

@Injectable()
export class MaintenanceRecordsService {
  constructor(
    @InjectModel('MaintenanceRecord')
    private maintenanceRecordModel: Model<MaintenanceRecord>,
  ) {}

  async create(createMaintenanceRecordDto: CreateMaintenanceRecordDto) {
    try {
      logger.info(`---MAINTENANCE_RECORDS.SERVICE.CREATE INIT---`);
      const maintenanceRecord = await this.maintenanceRecordModel.create(
        createMaintenanceRecordDto,
      );
      await maintenanceRecord.populate('equipment', 'name serialNumber');
      await maintenanceRecord.populate('technician', 'firstname lastname');
      logger.info(`---MAINTENANCE_RECORDS.SERVICE.CREATE SUCCESS---`);
      return maintenanceRecord;
    } catch (error) {
      logger.error(`---MAINTENANCE_RECORDS.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: FindMaintenanceRecordDto) {
    try {
      logger.info(`---MAINTENANCE_RECORDS.SERVICE.FIND_ALL INIT---`);
      const {
        page = 1,
        limit = 10,
        search,
        equipment,
        maintenanceType,
        status,
      } = query;
      const skip = (page - 1) * limit;

      const filters: any = {};
      if (equipment) filters.equipment = equipment;
      if (maintenanceType) filters.maintenanceType = maintenanceType;
      if (status) filters.status = status;

      if (search) {
        filters.$or = [
          { description: { $regex: search, $options: 'i' } },
          { notes: { $regex: search, $options: 'i' } },
        ];
      }

      const [data, total] = await Promise.all([
        this.maintenanceRecordModel
          .find(filters)
          .populate('equipment', 'name serialNumber')
          .populate('technician', 'firstname lastname')
          .sort({ created_at: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.maintenanceRecordModel.countDocuments(filters).exec(),
      ]);

      logger.info(`---MAINTENANCE_RECORDS.SERVICE.FIND_ALL SUCCESS---`);
      return {
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error(`---MAINTENANCE_RECORDS.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---MAINTENANCE_RECORDS.SERVICE.FIND_ONE INIT---`);
      const maintenanceRecord = await this.maintenanceRecordModel
        .findById(id)
        .populate('equipment', 'name serialNumber')
        .populate('technician', 'firstname lastname')
        .exec();
      if (!maintenanceRecord) {
        throw new HttpException(
          'Enregistrement de maintenance non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---MAINTENANCE_RECORDS.SERVICE.FIND_ONE SUCCESS---`);
      return maintenanceRecord;
    } catch (error) {
      logger.error(`---MAINTENANCE_RECORDS.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateMaintenanceRecordDto: UpdateMaintenanceRecordDto,
  ) {
    try {
      logger.info(`---MAINTENANCE_RECORDS.SERVICE.UPDATE INIT---`);
      const updated = await this.maintenanceRecordModel
        .findByIdAndUpdate(
          id,
          { ...updateMaintenanceRecordDto, updated_at: new Date() },
          { new: true },
        )
        .populate('equipment', 'name serialNumber')
        .populate('technician', 'firstname lastname')
        .exec();
      if (!updated) {
        throw new HttpException(
          'Enregistrement de maintenance non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---MAINTENANCE_RECORDS.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---MAINTENANCE_RECORDS.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---MAINTENANCE_RECORDS.SERVICE.REMOVE INIT---`);
      const deleted = await this.maintenanceRecordModel
        .findByIdAndDelete(id)
        .exec();
      if (!deleted) {
        throw new HttpException(
          'Enregistrement de maintenance non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---MAINTENANCE_RECORDS.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---MAINTENANCE_RECORDS.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
