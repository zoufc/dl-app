import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department } from './interfaces/department.interface';
import departments from '../../utils/seeds/departments.json';
import logger from 'src/utils/logger';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel('Department') private departmentModel: Model<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    try {
      logger.info(`---DEPARTMENT.SERVICE.CREATE INIT---`);
      const department = await this.departmentModel.create(createDepartmentDto);
      logger.info(`---DEPARTMENT.SERVICE.CREATE SUCCESS---`);
      return department;
    } catch (error) {
      logger.error(`---DEPARTMENT.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createMany() {
    try {
      logger.info(`---DEPARTMENT.SERVICE.CREATE_MANY INIT---`);
      const departmentSeeds = await this.departmentModel.insertMany(
        departments,
      );
      logger.info(`---DEPARTMENT.SERVICE.CREATE_MANY SUCCESS---`);
      return departmentSeeds;
    } catch (error) {
      logger.error(`---DEPARTMENT.SERVICE.CREATE_MANY ERROR ${error}---`);
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    name?: string;
    region?: string;
    search?: string;
  }): Promise<any> {
    try {
      logger.info(`---DEPARTMENT.SERVICE.FIND_ALL INIT---`);
      const { page = 1, limit = 10, name, region, search } = query;

      const filters: any = {};

      // Recherche globale
      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        filters.$or = [
          { name: { $regex: searchRegex } },
          { code: { $regex: searchRegex } },
        ];
      } else {
        // Sinon, utiliser les filtres individuels
        if (name) filters.name = { $regex: name, $options: 'i' };
      }
      if (region) filters.region = region;

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.departmentModel
          .find(filters)
          .skip(skip)
          .limit(limit)
          .sort({ name: 1 })
          .populate('region', 'name code')
          .lean(),
        this.departmentModel.countDocuments(filters),
      ]);

      logger.info(`---DEPARTMENT.SERVICE.FIND_ALL SUCCESS--- total=${total}`);
      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error(`---DEPARTMENT.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---DEPARTMENT.SERVICE.FIND_ONE INIT---`);
      const department = await this.departmentModel
        .findById(id)
        .populate('region', 'name code')
        .exec();
      if (!department) {
        throw new HttpException('Département non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---DEPARTMENT.SERVICE.FIND_ONE SUCCESS---`);
      return department;
    } catch (error) {
      logger.error(`---DEPARTMENT.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    try {
      logger.info(`---DEPARTMENT.SERVICE.UPDATE INIT---`);
      const updated = await this.departmentModel
        .findByIdAndUpdate(
          id,
          { ...updateDepartmentDto, updated_at: new Date() },
          { new: true },
        )
        .populate('region', 'name code')
        .exec();
      if (!updated) {
        throw new HttpException('Département non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---DEPARTMENT.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---DEPARTMENT.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---DEPARTMENT.SERVICE.REMOVE INIT---`);
      const deleted = await this.departmentModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException('Département non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---DEPARTMENT.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---DEPARTMENT.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
