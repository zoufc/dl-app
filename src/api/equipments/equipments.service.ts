import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Equipment } from './interfaces/equipment.interface';
import logger from 'src/utils/logger';
import mongoose from 'mongoose';

@Injectable()
export class EquipmentsService {
  constructor(
    @InjectModel('Equipment') private equipmentModel: Model<Equipment>,
  ) {}

  async create(createEquipmentDto: CreateEquipmentDto) {
    try {
      logger.info(`---EQUIPMENTS.SERVICE.CREATE INIT---`);

      // Calculer remainingQuantity si usedQuantity est fourni
      const equipmentData: any = {
        ...createEquipmentDto,
        usedQuantity: createEquipmentDto.usedQuantity || 0,
      };
      equipmentData.remainingQuantity =
        equipmentData.initialQuantity - equipmentData.usedQuantity;

      if (equipmentData.remainingQuantity < 0) {
        equipmentData.remainingQuantity = 0;
      }

      const equipment = await this.equipmentModel.create(equipmentData);
      await equipment.populate('lab', 'name');
      await equipment.populate('supplier', 'name email phoneNumber');
      await equipment.populate('equipmentType', 'name');
      await equipment.populate('location', 'name');

      logger.info(`---EQUIPMENTS.SERVICE.CREATE SUCCESS---`);
      return equipment;
    } catch (error) {
      logger.error(`---EQUIPMENTS.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message || "Erreur lors de la création de l'équipement",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    lab?: string;
    supplier?: string;
    equipmentType?: string;
    location?: string;
    status?: string;
    search?: string;
  }): Promise<any> {
    try {
      logger.info(`---EQUIPMENTS.SERVICE.FIND_ALL INIT---`);

      const {
        page = 1,
        limit = 10,
        lab,
        supplier,
        equipmentType,
        location,
        status,
        search,
      } = query;
      const skip = (page - 1) * limit;

      const filters: any = {};
      if (lab) filters.lab = lab;
      if (supplier) filters.supplier = supplier;
      if (equipmentType) filters.equipmentType = equipmentType;
      if (location) filters.location = location;
      if (status) filters.status = status;

      // Recherche globale
      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        filters.$or = [
          { name: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { serialNumber: { $regex: searchRegex } },
          { model: { $regex: searchRegex } },
          { brand: { $regex: searchRegex } },
        ];
      }

      const [data, total] = await Promise.all([
        this.equipmentModel
          .find(filters)
          .populate('lab', 'name')
          .populate('supplier', 'name email phoneNumber')
          .populate('equipmentType', 'name')
          .populate('location', 'name')
          .sort({ created_at: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.equipmentModel.countDocuments(filters),
      ]);

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error(`---EQUIPMENTS.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      logger.info(`---EQUIPMENTS.SERVICE.FIND_ONE INIT--- id=${id}`);
      const equipment = await this.equipmentModel
        .findById(id)
        .populate('lab', 'name')
        .populate('supplier', 'name email phoneNumber address')
        .populate('equipmentType', 'name')
        .populate('location', 'name')
        .lean();

      if (!equipment) {
        throw new HttpException('Équipement non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---EQUIPMENTS.SERVICE.FIND_ONE SUCCESS--- id=${id}`);
      return equipment;
    } catch (error) {
      logger.error(`---EQUIPMENTS.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateEquipmentDto: UpdateEquipmentDto,
  ): Promise<any> {
    try {
      logger.info(`---EQUIPMENTS.SERVICE.UPDATE INIT--- id=${id}`);

      // Si initialQuantity ou usedQuantity est modifié, recalculer remainingQuantity
      const updateData: any = { ...updateEquipmentDto, updated_at: new Date() };

      if (
        updateEquipmentDto.initialQuantity !== undefined ||
        updateEquipmentDto.usedQuantity !== undefined
      ) {
        const current = await this.equipmentModel
          .findById(id)
          .select('initialQuantity usedQuantity')
          .lean();
        const newInitialQuantity =
          updateEquipmentDto.initialQuantity ?? current?.initialQuantity ?? 0;
        const newUsedQuantity =
          updateEquipmentDto.usedQuantity ?? current?.usedQuantity ?? 0;
        updateData.remainingQuantity = newInitialQuantity - newUsedQuantity;
        if (updateData.remainingQuantity < 0) {
          updateData.remainingQuantity = 0;
        }
      }

      const updated = await this.equipmentModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .populate('lab', 'name')
        .populate('supplier', 'name email phoneNumber')
        .populate('equipmentType', 'name')
        .populate('location', 'name')
        .lean();

      if (!updated) {
        throw new HttpException('Équipement non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---EQUIPMENTS.SERVICE.UPDATE SUCCESS--- id=${id}`);
      return updated;
    } catch (error) {
      logger.error(`---EQUIPMENTS.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---EQUIPMENTS.SERVICE.REMOVE INIT--- id=${id}`);
      const deleted = await this.equipmentModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException('Équipement non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---EQUIPMENTS.SERVICE.REMOVE SUCCESS--- id=${id}`);
      return deleted;
    } catch (error) {
      logger.error(`---EQUIPMENTS.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
