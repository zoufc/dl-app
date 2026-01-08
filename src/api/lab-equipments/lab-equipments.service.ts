import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LabEquipment } from './interfaces/lab-equipment.interface';
import { CreateLabEquipmentDto } from './dto/create-lab-equipment.dto';
import { UpdateLabEquipmentDto } from './dto/update-lab-equipment.dto';
import { FindLabEquipmentDto } from './dto/find-lab-equipment.dto';
import { LabEquipmentStock } from '../lab-equipment-stocks/interfaces/lab-equipment-stock.interface';
import { Equipment } from '../equipments/interfaces/equipment.interface';
import {
  LabEquipmentStatus,
  LabInventoryStatus,
} from './schemas/lab-equipment.schema';
import { Role } from 'src/utils/enums/roles.enum';
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
    userId?: string,
  ): Promise<LabEquipment> {
    try {
      logger.info(`---LAB_EQUIPMENTS.SERVICE.CREATE INIT---`);
      const { lab, equipment } = createLabEquipmentDto;

      // ... (code commenté)

      // 2. Créer le lab-équipement
      const labEquipment = await this.labEquipmentModel.create({
        ...createLabEquipmentDto,
        createdBy: userId,
        affectedToBy: createLabEquipmentDto['affectedTo'] ? userId : null,
      });

      // ... (code commenté)

      await labEquipment.populate('lab', 'name');
      await labEquipment.populate('equipment', 'name');
      await labEquipment.populate(
        'createdBy',
        'firstname lastname phoneNumber email',
      );
      await labEquipment.populate(
        'affectedTo',
        'firstname lastname phoneNumber email',
      );

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
          .populate('createdBy', 'firstname lastname phoneNumber email')
          .populate('affectedTo', 'firstname lastname phoneNumber email')
          .populate('affectedToBy', 'firstname lastname phoneNumber email')
          .populate('receivedBy', 'firstname lastname phoneNumber email')
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
        .populate('createdBy', 'firstname lastname phoneNumber email')
        .populate('affectedTo', 'firstname lastname phoneNumber email')
        .populate('affectedToBy', 'firstname lastname phoneNumber email')
        .populate('receivedBy', 'firstname lastname phoneNumber email')
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
    user?: any,
  ): Promise<LabEquipment> {
    try {
      logger.info(`---LAB_EQUIPMENTS.SERVICE.UPDATE INIT--- id=${id}`);

      const existing = await this.labEquipmentModel.findById(id);
      if (!existing) {
        throw new HttpException(
          'Équipement du labo non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }

      // Restriction sur affectedTo
      if (
        updateLabEquipmentDto.affectedTo &&
        updateLabEquipmentDto.affectedTo.toString() !==
          (existing.affectedTo ? existing.affectedTo.toString() : null)
      ) {
        if (!user) {
          throw new HttpException('Non autorisé', HttpStatus.UNAUTHORIZED);
        }

        const isSuperAdmin = user.role === Role.SuperAdmin;
        const isLabAdminOfThisLab =
          user.role === Role.LabAdmin &&
          user.lab?.toString() === existing.lab.toString();

        if (!isSuperAdmin && !isLabAdminOfThisLab) {
          throw new HttpException(
            "Seul un Super Admin ou l'Admin de ce laboratoire peut modifier l'affectation",
            HttpStatus.FORBIDDEN,
          );
        }

        // Si autorisé, on enregistre qui a fait l'affectation
        updateLabEquipmentDto.affectedToBy = user._id;
      }

      const updated = await this.labEquipmentModel
        .findByIdAndUpdate(
          id,
          { ...updateLabEquipmentDto, updated_at: new Date() },
          { new: true },
        )
        .populate('lab', 'name')
        .populate('createdBy', 'firstname lastname phoneNumber email')
        .populate('affectedTo', 'firstname lastname phoneNumber email')
        .populate('affectedToBy', 'firstname lastname phoneNumber email')
        .populate('receivedBy', 'firstname lastname phoneNumber email')
        .populate({
          path: 'equipment',
          select: 'name equipmentType',
          populate: {
            path: 'equipmentType',
            select: 'name',
          },
        })
        .exec();

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

  async receive(id: string, userId: string): Promise<LabEquipment> {
    try {
      logger.info(`---LAB_EQUIPMENTS.SERVICE.RECEIVE INIT--- id=${id}`);
      const labEquipment = await this.labEquipmentModel.findById(id);

      if (!labEquipment) {
        throw new HttpException(
          'Équipement du labo non trouvé',
          HttpStatus.NOT_FOUND,
        );
      }

      if (labEquipment.inventoryStatus !== LabInventoryStatus.IN_DELIVERY) {
        throw new HttpException(
          "L'équipement n'est pas en cours de livraison",
          HttpStatus.BAD_REQUEST,
        );
      }

      labEquipment.inventoryStatus = LabInventoryStatus.AVAILABLE;
      labEquipment.receivedBy = userId as any;
      labEquipment.receivedDate = new Date();
      labEquipment.updated_at = new Date();

      const updated = await labEquipment.save();
      await updated.populate(
        'receivedBy',
        'firstname lastname phoneNumber email',
      );

      // Optionnel: Mettre à jour le stock ici?
      // Si on suit la logique précédente, le stock est déjà mis à jour lors du passage de la commande à COMPLETED.
      // Mais si on veut être précis, le stock "réellement disponible" (remainingQuantity) pourrait dépendre de la réception.
      // Cependant, la demande ne mentionne pas explicitement la mise à jour du stock ici.

      logger.info(`---LAB_EQUIPMENTS.SERVICE.RECEIVE SUCCESS--- id=${id}`);
      return updated;
    } catch (error) {
      logger.error(`---LAB_EQUIPMENTS.SERVICE.RECEIVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
