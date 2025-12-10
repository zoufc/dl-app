import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import logger from 'src/utils/logger';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto, @Res() res) {
    try {
      logger.info(`---DEPARTMENT.CONTROLLER.CREATE INIT---`);
      const department = await this.departmentService.create(createDepartmentDto);
      logger.info(`---DEPARTMENT.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({message:"Département créé",data:department})
    } catch (error) {
      logger.error(`---DEPARTMENT.CONTROLLER.CREATE ERROR ${error}---`);
      return res.status(error.status).json(error)
    }
  }

  @Post('seeds')
  async createMany(@Res() res) {
    try {
      logger.info(`---DEPARTMENT.CONTROLLER.CREATE_MANY INIT---`);
      const departments=await this.departmentService.createMany()
      logger.info(`---DEPARTMENT.CONTROLLER.CREATE_MANY SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({message:"Départements créés",data:departments})
    } catch (error) {
      logger.error(`---DEPARTMENT.CONTROLLER.CREATE_MANY ERROR ${error}---`);
      return res.status(error.status).json(error)
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      logger.info(`---DEPARTMENT.CONTROLLER.FIND_ALL INIT---`);
      const departments = await this.departmentService.findAll();
      logger.info(`---DEPARTMENT.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des départements',
        data: departments
      });
    } catch (error) {
      logger.error(`---DEPARTMENT.CONTROLLER.FIND_ALL ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---DEPARTMENT.CONTROLLER.FIND_ONE INIT---`);
      const department = await this.departmentService.findOne(id);
      logger.info(`---DEPARTMENT.CONTROLLER.FIND_ONE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Département ${id}`,
        data: department
      });
    } catch (error) {
      logger.error(`---DEPARTMENT.CONTROLLER.FIND_ONE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto, @Res() res) {
    try {
      logger.info(`---DEPARTMENT.CONTROLLER.UPDATE INIT---`);
      const updated = await this.departmentService.update(id, updateDepartmentDto);
      logger.info(`---DEPARTMENT.CONTROLLER.UPDATE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Département ${id} mis à jour`,
        data: updated
      });
    } catch (error) {
      logger.error(`---DEPARTMENT.CONTROLLER.UPDATE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---DEPARTMENT.CONTROLLER.REMOVE INIT---`);
      const deleted = await this.departmentService.remove(id);
      logger.info(`---DEPARTMENT.CONTROLLER.REMOVE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Département ${id} supprimé`,
        data: deleted
      });
    } catch (error) {
      logger.error(`---DEPARTMENT.CONTROLLER.REMOVE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
