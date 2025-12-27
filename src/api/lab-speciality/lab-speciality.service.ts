import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLabSpecialityDto } from './dto/create-lab-speciality.dto';
import { UpdateLabSpecialityDto } from './dto/update-lab-speciality.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LabSpeciality } from './interfaces/lab-speciality.interface';
import logger from 'src/utils/logger';

@Injectable()
export class LabSpecialityService {
  constructor(
    @InjectModel('LabSpeciality')
    private labSpecialityModel: Model<LabSpeciality>,
  ) {}

  async create(createLabSpecialityDto: CreateLabSpecialityDto) {
    try {
      logger.info(`---LAB_SPECIALITY.SERVICE.CREATE INIT---`);
      const existLabSpeciality = await this.labSpecialityModel.findOne({
        lab: createLabSpecialityDto.lab,
        speciality: createLabSpecialityDto.speciality,
      });
      if (existLabSpeciality) {
        throw new HttpException(
          'Cette spécialité existe déjà pour ce laboratoire',
          HttpStatus.CONFLICT,
        );
      }
      const labSpeciality = await this.labSpecialityModel.create(
        createLabSpecialityDto,
      );
      await labSpeciality.populate('lab', 'structure');
      await labSpeciality.populate('speciality', 'name');
      logger.info(`---LAB_SPECIALITY.SERVICE.CREATE SUCCESS---`);
      return labSpeciality;
    } catch (error) {
      logger.error(`---LAB_SPECIALITY.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    lab?: string;
    speciality?: string;
    status?: string;
  }): Promise<any> {
    try {
      logger.info(`---LAB_SPECIALITY.SERVICE.FIND_ALL INIT---`);

      const { page = 1, limit = 10, lab, speciality, status } = query;

      const skip = (page - 1) * limit;

      // Construire les filtres
      const filters: any = {};
      if (lab) filters.lab = lab;
      if (speciality) filters.speciality = speciality;
      if (status) filters.status = status;

      const [data, total] = await Promise.all([
        this.labSpecialityModel
          .find(filters)
          .populate({
            path: 'lab',
            select: 'name structure',
            populate: {
              path: 'structure',
              select: 'name',
            },
          })
          .populate('speciality', 'name description')
          .skip(skip)
          .limit(limit)
          .sort({ created_at: -1 })
          .lean(),

        this.labSpecialityModel.countDocuments(filters),
      ]);

      logger.info(
        `---LAB_SPECIALITY.SERVICE.FIND_ALL SUCCESS--- total=${total}`,
      );

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error(`---LAB_SPECIALITY.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---LAB_SPECIALITY.SERVICE.FIND_ONE INIT---`);
      const labSpeciality = await this.labSpecialityModel
        .findById(id)
        .populate('lab', 'structure')
        .populate('speciality', 'name')
        .exec();
      if (!labSpeciality) {
        throw new HttpException(
          'Spécialité de laboratoire non trouvée',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---LAB_SPECIALITY.SERVICE.FIND_ONE SUCCESS---`);
      return labSpeciality;
    } catch (error) {
      logger.error(`---LAB_SPECIALITY.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateLabSpecialityDto: UpdateLabSpecialityDto) {
    try {
      logger.info(`---LAB_SPECIALITY.SERVICE.UPDATE INIT---`);
      const updated = await this.labSpecialityModel
        .findByIdAndUpdate(
          id,
          { ...updateLabSpecialityDto, updated_at: new Date() },
          { new: true },
        )
        .populate('lab', 'structure')
        .populate('speciality', 'name')
        .exec();
      if (!updated) {
        throw new HttpException(
          'Spécialité de laboratoire non trouvée',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---LAB_SPECIALITY.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---LAB_SPECIALITY.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---LAB_SPECIALITY.SERVICE.REMOVE INIT---`);
      const deleted = await this.labSpecialityModel
        .findByIdAndDelete(id)
        .exec();
      if (!deleted) {
        throw new HttpException(
          'Spécialité de laboratoire non trouvée',
          HttpStatus.NOT_FOUND,
        );
      }
      logger.info(`---LAB_SPECIALITY.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---LAB_SPECIALITY.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
