import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { FindMaintenanceDto } from './dto/find-maintenance.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Maintenance } from './entities/maintenance.entity';
import logger from 'src/utils/logger';
import {
  MaintenanceStatus,
  ScheduleFrequency,
} from './schemas/maintenance.schema';

@Injectable()
export class MaintenancesService {
  constructor(
    @InjectModel('Maintenance')
    private maintenanceModel: Model<Maintenance>,
  ) {}

  private calculateNextDate(
    date: Date,
    frequency: ScheduleFrequency,
  ): Date | null {
    const nextDate = new Date(date);
    switch (frequency) {
      case ScheduleFrequency.DAILY:
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case ScheduleFrequency.WEEKLY:
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case ScheduleFrequency.MONTHLY:
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case ScheduleFrequency.QUARTERLY:
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case ScheduleFrequency.YEARLY:
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      case ScheduleFrequency.ONCE:
      default:
        return null;
    }
    return nextDate;
  }

  async create(createMaintenanceDto: CreateMaintenanceDto) {
    try {
      logger.info(`---MAINTENANCES.SERVICE.CREATE INIT---`);

      const maintenanceDate = createMaintenanceDto.date
        ? new Date(createMaintenanceDto.date)
        : new Date();

      // 1. Si la maintenance est déjà "COMPLETED", on enregistre la date de réalisation
      if (createMaintenanceDto.status === MaintenanceStatus.COMPLETED) {
        createMaintenanceDto.lastMaintenanceDate = maintenanceDate;

        // Calcul de la prochaine date si une fréquence est définie
        if (
          createMaintenanceDto.frequency &&
          createMaintenanceDto.frequency !== ScheduleFrequency.ONCE
        ) {
          createMaintenanceDto.nextMaintenanceDate = this.calculateNextDate(
            maintenanceDate,
            createMaintenanceDto.frequency as ScheduleFrequency,
          );
        }
      } else {
        // Si elle n'est pas terminée (ex: SCHEDULED), la date prévue est la prochaine date
        createMaintenanceDto.nextMaintenanceDate = maintenanceDate;
      }

      const maintenance = await this.maintenanceModel.create(
        createMaintenanceDto,
      );
      await maintenance.populate({
        path: 'labEquipment',
        populate: {
          path: 'equipment',
          select: 'name model brand serialNumber',
        },
      });
      await maintenance.populate(
        'technician',
        'firstname lastname phoneNumber email',
      );
      logger.info(`---MAINTENANCES.SERVICE.CREATE SUCCESS---`);
      return maintenance;
    } catch (error) {
      logger.error(`---MAINTENANCES.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: FindMaintenanceDto) {
    try {
      logger.info(`---MAINTENANCES.SERVICE.FIND_ALL INIT---`);
      const {
        page = 1,
        limit = 10,
        search,
        labEquipment,
        maintenanceType,
        status,
        technician,
        frequency,
      } = query;
      const skip = (page - 1) * limit;

      const filters: any = {};
      if (labEquipment) filters.labEquipment = labEquipment;
      if (maintenanceType) filters.maintenanceType = maintenanceType;
      if (status) filters.status = status;
      if (technician) filters.technician = technician;
      if (frequency) filters.frequency = frequency;

      if (search) {
        filters.$or = [
          { description: { $regex: search, $options: 'i' } },
          { notes: { $regex: search, $options: 'i' } },
        ];
      }

      const [data, total] = await Promise.all([
        this.maintenanceModel
          .find(filters)
          .populate({
            path: 'labEquipment',
            populate: {
              path: 'equipment',
              select: 'name model brand serialNumber',
            },
          })
          .populate('technician', 'firstname lastname phoneNumber email')
          .sort({ created_at: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.maintenanceModel.countDocuments(filters).exec(),
      ]);

      logger.info(`---MAINTENANCES.SERVICE.FIND_ALL SUCCESS---`);
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
      logger.error(`---MAINTENANCES.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---MAINTENANCES.SERVICE.FIND_ONE INIT---`);
      const maintenance = await this.maintenanceModel
        .findById(id)
        .populate({
          path: 'labEquipment',
          populate: {
            path: 'equipment',
            select: 'name model brand serialNumber',
          },
        })
        .populate('technician', 'firstname lastname phoneNumber email')
        .exec();
      if (!maintenance) {
        throw new HttpException(
          'Enregistrement de maintenance non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---MAINTENANCES.SERVICE.FIND_ONE SUCCESS---`);
      return maintenance;
    } catch (error) {
      logger.error(`---MAINTENANCES.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateMaintenanceDto: UpdateMaintenanceDto) {
    try {
      logger.info(`---MAINTENANCES.SERVICE.UPDATE INIT--- id=${id}`);

      // Récupérer la maintenance actuelle pour comparer le statut
      const current = await this.maintenanceModel.findById(id);
      if (!current) {
        throw new HttpException(
          'Enregistrement de maintenance non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }

      // Si le statut passe à COMPLETED, ou si on met à jour une maintenance déjà COMPLETED
      const newStatus = updateMaintenanceDto.status || current.status;
      if (newStatus === MaintenanceStatus.COMPLETED) {
        const maintenanceDate = updateMaintenanceDto.date
          ? new Date(updateMaintenanceDto.date)
          : current.date || new Date();

        updateMaintenanceDto.lastMaintenanceDate = maintenanceDate;

        const frequency =
          (updateMaintenanceDto.frequency as ScheduleFrequency) ||
          current.frequency;
        if (frequency && frequency !== ScheduleFrequency.ONCE) {
          updateMaintenanceDto.nextMaintenanceDate = this.calculateNextDate(
            maintenanceDate,
            frequency,
          );
        }
      } else {
        // Si le statut n'est pas COMPLETED (ex: SCHEDULED)
        // On met à jour nextMaintenanceDate si la date ou la fréquence change
        if (updateMaintenanceDto.date) {
          updateMaintenanceDto.nextMaintenanceDate = new Date(
            updateMaintenanceDto.date,
          );
        }
      }

      const updated = await this.maintenanceModel
        .findByIdAndUpdate(
          id,
          { ...updateMaintenanceDto, updated_at: new Date() },
          { new: true },
        )
        .populate({
          path: 'labEquipment',
          populate: {
            path: 'equipment',
            select: 'name model brand',
          },
        })
        .populate('technician', 'firstname lastname phoneNumber email')
        .exec();

      logger.info(`---MAINTENANCES.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---MAINTENANCES.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---MAINTENANCES.SERVICE.REMOVE INIT---`);
      const deleted = await this.maintenanceModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException(
          'Enregistrement de maintenance non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---MAINTENANCES.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---MAINTENANCES.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
