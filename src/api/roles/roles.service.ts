import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './entities/role.entity';
import logger from 'src/utils/logger';

@Injectable()
export class RolesService {
  constructor(@InjectModel('Role') private roleModel: Model<Role>) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      logger.info(`---ROLES.SERVICE.CREATE INIT---`);
      const role = await this.roleModel.create(createRoleDto);
      logger.info(`---ROLES.SERVICE.CREATE SUCCESS---`);
      return role;
    } catch (error) {
      logger.error(`---ROLES.SERVICE.CREATE ERROR ${error}---`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      logger.info(`---ROLES.SERVICE.FIND_ALL INIT---`);
      const roles = await this.roleModel.find().sort({ name: 1 }).exec();
      logger.info(`---ROLES.SERVICE.FIND_ALL SUCCESS---`);
      return roles;
    } catch (error) {
      logger.error(`---ROLES.SERVICE.FIND_ALL ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      logger.info(`---ROLES.SERVICE.FIND_ONE INIT---`);
      const role = await this.roleModel.findById(id).exec();
      if (!role) {
        throw new HttpException('Rôle non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---ROLES.SERVICE.FIND_ONE SUCCESS---`);
      return role;
    } catch (error) {
      logger.error(`---ROLES.SERVICE.FIND_ONE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      logger.info(`---ROLES.SERVICE.UPDATE INIT---`);
      const updated = await this.roleModel
        .findByIdAndUpdate(
          id,
          { ...updateRoleDto, updated_at: new Date() },
          { new: true },
        )
        .exec();
      if (!updated) {
        throw new HttpException('Rôle non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---ROLES.SERVICE.UPDATE SUCCESS---`);
      return updated;
    } catch (error) {
      logger.error(`---ROLES.SERVICE.UPDATE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      logger.info(`---ROLES.SERVICE.REMOVE INIT---`);
      const deleted = await this.roleModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException('Rôle non trouvé', HttpStatus.NOT_FOUND);
      }
      logger.info(`---ROLES.SERVICE.REMOVE SUCCESS---`);
      return deleted;
    } catch (error) {
      logger.error(`---ROLES.SERVICE.REMOVE ERROR ${error}---`);
      throw new HttpException(
        error.message || 'Erreur serveur',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
