import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import logger from 'src/utils/logger';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto, @Res() res) {
    try {
      logger.info(`---ROLES.CONTROLLER.CREATE INIT---`);
      const role = await this.rolesService.create(createRoleDto);
      logger.info(`---ROLES.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({
        message: 'Rôle créé avec succès',
        data: role,
      });
    } catch (error) {
      logger.error(`---ROLES.CONTROLLER.CREATE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      logger.info(`---ROLES.CONTROLLER.FIND_ALL INIT---`);
      const roles = await this.rolesService.findAll();
      logger.info(`---ROLES.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des rôles',
        data: roles,
      });
    } catch (error) {
      logger.error(`---ROLES.CONTROLLER.FIND_ALL ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---ROLES.CONTROLLER.FIND_ONE INIT---`);
      const role = await this.rolesService.findOne(id);
      logger.info(`---ROLES.CONTROLLER.FIND_ONE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Rôle ${id}`,
        data: role,
      });
    } catch (error) {
      logger.error(`---ROLES.CONTROLLER.FIND_ONE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res() res,
  ) {
    try {
      logger.info(`---ROLES.CONTROLLER.UPDATE INIT---`);
      const updated = await this.rolesService.update(id, updateRoleDto);
      logger.info(`---ROLES.CONTROLLER.UPDATE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Rôle ${id} mis à jour`,
        data: updated,
      });
    } catch (error) {
      logger.error(`---ROLES.CONTROLLER.UPDATE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---ROLES.CONTROLLER.REMOVE INIT---`);
      const deleted = await this.rolesService.remove(id);
      logger.info(`---ROLES.CONTROLLER.REMOVE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Rôle ${id} supprimé`,
        data: deleted,
      });
    } catch (error) {
      logger.error(`---ROLES.CONTROLLER.REMOVE ERROR ${error}---`);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
