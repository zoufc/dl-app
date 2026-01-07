import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LabEquipment } from './interfaces/lab-equipment.interface';
import { CreateLabEquipmentDto } from './dto/create-lab-equipment.dto';
import { UpdateLabEquipmentDto } from './dto/update-lab-equipment.dto';
import { FindLabEquipmentDto } from './dto/find-lab-equipment.dto';
import { LabEquipmentStock } from '../lab-equipment-stocks/interfaces/lab-equipment-stock.interface';
import { Equipment } from '../equipments/interfaces/equipment.interface';
import logger from 'src/utils/logger';

@Injectable()
export class LabEquipmentsService {
  constructor(
    @InjectModel('LabEquipment') private labEquipmentModel: Model<LabEquipment>,
    @InjectModel('LabEquipmentStock')
    private labEquipmentStockModel: Model<LabEquipmentStock>,
    @InjectModel('Equipment') private equipmentModel: Model<Equipment>,
  ) {}

  async create(
    createLabEquipmentDto: CreateLabEquipmentDto,
  ): Promise<LabEquipment> {
    try {
      logger.info(`---LAB_EQUIPMENTS.SERVICE.CREATE INIT---`);
      const { lab, equipment } = createLabEquipmentDto;

      // 1. Vérifier la disponibilité en stock
      const stock = await this.labEquipmentStockModel.findOne({
        lab,
        equipment,
      });
      if (!stock) {
        throw new HttpException(
          'Stock non trouvé pour cet équipement dans ce laboratoire',
          HttpStatus.NOT_FOUND,
        );
      }

      if (stock.remainingQuantity <= 0) {
        throw new HttpException(
          'Stock insuffisant pour cet équipement (quantité restante: 0)',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 2. Créer le lab-équipement
      const labEquipment = await this.labEquipmentModel.create(
        createLabEquipmentDto,
      );

      // 3. Mettre à jour le stock (incrémenter usedQuantity)
      stock.usedQuantity += 1;

      stock.remainingQuantity = stock.initialQuantity - stock.usedQuantity;
      if (stock.remainingQuantity < 0) {
        stock.remainingQuantity = 0;
      }

      await stock.save();

      logger.info(`---LAB_EQUIPMENTS.SERVICE.CREATE SUCCESS---`);
      return labEquipment;
    } catch (error) {
      logger.error(`---LAB_EQUIPMENTS.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message || "Erreur lors de la création de l'équipement du labo",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: FindLabEquipmentDto): Promise<any> {
    try {
      logger.info(`---LAB_EQUIPMENTS.SERVICE.FIND_ALL INIT---`);
      const {
        page = 1,
        limit = 10,
        lab,
        equipment,
        equipmentType,
        status,
        inventoryStatus,
        search,
      } = query;
      const skip = (page - 1) * limit;

      const filters: any = {};
      if (lab) filters.lab = lab;
      if (equipment) filters.equipment = equipment;
      if (status) filters.status = status;
      if (inventoryStatus) filters.inventoryStatus = inventoryStatus;

      // Filtrer par type d'équipement
      if (equipmentType) {
        const equipments = await this.equipmentModel
          .find({ equipmentType })
          .select('_id')
          .lean();
        const equipmentIds = equipments.map((e) => e._id);
        filters.equipment = { $in: equipmentIds };
      }

      if (search) {
        filters.$or = [
          { serialNumber: { $regex: search, $options: 'i' } },
          { modelName: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { notes: { $regex: search, $options: 'i' } },
        ];
      }

      const [data, total] = await Promise.all([
        this.labEquipmentModel
          .find(filters)
          .populate('lab', 'name')
          .populate({
            path: 'equipment',
            select: 'name equipmentType',
            populate: {
              path: 'equipmentType',
              select: 'name',
            },
          })
          .sort({ created_at: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.labEquipmentModel.countDocuments(filters).exec(),
      ]);

      logger.info(`---LAB_EQUIPMENTS.SERVICE.FIND_ALL SUCCESS---`);
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
      logger.error(`---LAB_EQUIPMENTS.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<LabEquipment> {
    try {
      logger.info(`---LAB_EQUIPMENTS.SERVICE.FIND_ONE INIT--- id=${id}`);
      const labEquipment = await this.labEquipmentModel
        .findById(id)
        .populate('lab', 'name')
        .populate({
          path: 'equipment',
          select: 'name equipmentType',
          populate: {
            path: 'equipmentType',
            select: 'name',
          },
        })
        .exec();

      if (!labEquipment) {
        throw new HttpException(
          'Équipement du labo non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---LAB_EQUIPMENTS.SERVICE.FIND_ONE SUCCESS--- id=${id}`);
      return labEquipment;
    } catch (error) {
      logger.error(`---LAB_EQUIPMENTS.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateLabEquipmentDto: UpdateLabEquipmentDto,
  ): Promise<LabEquipment> {
    try {
      logger.info(`---LAB_EQUIPMENTS.SERVICE.UPDATE INIT--- id=${id}`);
      const updated = await this.labEquipmentModel
        .findByIdAndUpdate(
          id,
          { ...updateLabEquipmentDto, updated_at: new Date() },
          { new: true },
        )
        .exec();

      if (!updated) {
        throw new HttpException(
          'Équipement du labo non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---LAB_EQUIPMENTS.SERVICE.UPDATE SUCCESS--- id=${id}`);
      return updated;
    } catch (error) {
      logger.error(`---LAB_EQUIPMENTS.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<LabEquipment> {
    try {
      logger.info(`---LAB_EQUIPMENTS.SERVICE.REMOVE INIT--- id=${id}`);
      const labEquipment = await this.labEquipmentModel.findById(id);
      if (!labEquipment) {
        throw new HttpException(
          'Équipement du labo non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }

      const deleted = await this.labEquipmentModel.findByIdAndDelete(id).exec();

      // Mettre à jour le stock (décrémenter usedQuantity)
      const stock = await this.labEquipmentStockModel.findOne({
        lab: labEquipment.lab,
        equipment: labEquipment.equipment,
      });
      if (stock) {
        stock.usedQuantity -= 1;
        if (stock.usedQuantity < 0) stock.usedQuantity = 0;
        await stock.save();
      }

      logger.info(`---LAB_EQUIPMENTS.SERVICE.REMOVE SUCCESS--- id=${id}`);
      return deleted;
    } catch (error) {
      logger.error(`---LAB_EQUIPMENTS.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
