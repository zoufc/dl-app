import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department } from './interfaces/department.interface';
import departments from '../../utils/seeds/departments.json'
import logger from 'src/utils/logger';

@Injectable()
export class DepartmentService {
  constructor(@InjectModel('Department') private departmentModel:Model<Department>){}
  
  async create(createDepartmentDto: CreateDepartmentDto) {
    try {
      logger.info(`---DEPARTMENT.SERVICE.CREATE INIT---`);
      const department = await this.departmentModel.create(createDepartmentDto);
      logger.info(`---DEPARTMENT.SERVICE.CREATE SUCCESS---`);
      return department;
    } catch (error) {
      logger.error(`---DEPARTMENT.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createMany(){
    try {
      logger.info(`---DEPARTMENT.SERVICE.CREATE_MANY INIT---`);
      const departmentSeeds=await this.departmentModel.insertMany(departments)
      logger.info(`---DEPARTMENT.SERVICE.CREATE_MANY SUCCESS---`);
      return departmentSeeds;
    } catch (error) {
      logger.error(`---DEPARTMENT.SERVICE.CREATE_MANY ERROR ${error}---`);
      throw new HttpException(error.message,error.status)
    }
  }

  async findAll() {
    try {
      logger.info(`---DEPARTMENT.SERVICE.FIND_ALL INIT---`);
      const departments = await this.departmentModel.find().sort({ name: 1 }).exec();
      logger.info(`---DEPARTMENT.SERVICE.FIND_ALL SUCCESS---`);
      return departments;
    } catch (error) {
      logger.error(`---DEPARTMENT.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---DEPARTMENT.SERVICE.FIND_ONE INIT---`);
      const department = await this.departmentModel.findById(id).exec();
      if (!department) {
        throw new HttpException('Département non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---DEPARTMENT.SERVICE.FIND_ONE SUCCESS---`);
      return department;
    } catch (error) {
      logger.error(`---DEPARTMENT.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    try {
      logger.info(`---DEPARTMENT.SERVICE.UPDATE INIT---`);
      const updated = await this.departmentModel.findByIdAndUpdate(
        id,
        { ...updateDepartmentDto, updated_at: new Date() },
        { new: true }
      ).exec();
      if (!updated) {
        throw new HttpException('Département non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---DEPARTMENT.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---DEPARTMENT.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
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
      throw new HttpException(error.message || 'Erreur serveur', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
