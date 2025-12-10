import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { LabSpecialityService } from './lab-speciality.service';
import { CreateLabSpecialityDto } from './dto/create-lab-speciality.dto';
import { UpdateLabSpecialityDto } from './dto/update-lab-speciality.dto';
import logger from 'src/utils/logger';

@Controller('lab-specialities')
export class LabSpecialityController {
  constructor(private readonly labSpecialityService: LabSpecialityService) {}

  @Post()
  async create(@Body() createLabSpecialityDto: CreateLabSpecialityDto,@Res() res) {
    try {
      logger.info(`---LAB_SPECIALITY.CONTROLLER.CREATE INIT---`);
      const labSpeciality=await this.labSpecialityService.create(createLabSpecialityDto);
      logger.info(`---LAB_SPECIALITY.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.OK).json({message:"Spécialité ajouté au labo!",data:labSpeciality})
    } catch (error) {
      logger.error(`---LAB_SPECIALITY.CONTROLLER.CREATE ERROR ${error}---`);
      return res.status(error.status).json(error)
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      logger.info(`---LAB_SPECIALITY.CONTROLLER.FIND_ALL INIT---`);
      const labSpecialities = await this.labSpecialityService.findAll();
      logger.info(`---LAB_SPECIALITY.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des spécialités de laboratoire',
        data: labSpecialities
      });
    } catch (error) {
      logger.error(`---LAB_SPECIALITY.CONTROLLER.FIND_ALL ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---LAB_SPECIALITY.CONTROLLER.FIND_ONE INIT---`);
      const labSpeciality = await this.labSpecialityService.findOne(id);
      logger.info(`---LAB_SPECIALITY.CONTROLLER.FIND_ONE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Spécialité de laboratoire ${id}`,
        data: labSpeciality
      });
    } catch (error) {
      logger.error(`---LAB_SPECIALITY.CONTROLLER.FIND_ONE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLabSpecialityDto: UpdateLabSpecialityDto, @Res() res) {
    try {
      logger.info(`---LAB_SPECIALITY.CONTROLLER.UPDATE INIT---`);
      const updated = await this.labSpecialityService.update(id, updateLabSpecialityDto);
      logger.info(`---LAB_SPECIALITY.CONTROLLER.UPDATE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Spécialité de laboratoire ${id} mise à jour`,
        data: updated
      });
    } catch (error) {
      logger.error(`---LAB_SPECIALITY.CONTROLLER.UPDATE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---LAB_SPECIALITY.CONTROLLER.REMOVE INIT---`);
      const deleted = await this.labSpecialityService.remove(id);
      logger.info(`---LAB_SPECIALITY.CONTROLLER.REMOVE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Spécialité de laboratoire ${id} supprimée`,
        data: deleted
      });
    } catch (error) {
      logger.error(`---LAB_SPECIALITY.CONTROLLER.REMOVE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
