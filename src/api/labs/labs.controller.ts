import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query } from '@nestjs/common';
import { LabsService } from './labs.service';
import { CreateLabDto } from './dto/create-lab.dto';
import { UpdateLabDto } from './dto/update-lab.dto';
import { FindLabsDto } from './dto/find-lab.dto';
import { Roles } from 'src/utils/decorators/role.decorator';
import { Role } from 'src/utils/enums/roles.enum';
import logger from 'src/utils/logger';

@Controller('labs')
export class LabsController {
  constructor(private readonly labsService: LabsService) {}

  @Post()
  async create(@Body() createLabDto: CreateLabDto,@Res() res) {
    try {
      const lab=await this.labsService.create(createLabDto);
      return res.status(HttpStatus.CREATED).json({message:"Laboratoire créé",data:lab})
    } catch (error) { 
      return res.status(error.status).json(error)
    }
  }

  @Get()
  async findAll(
    @Query() query: FindLabsDto,
    @Res() res
  ) {
    try {
      const result = await this.labsService.findAll(query);

      return res.status(HttpStatus.OK).json({
        message: 'Liste des laboratoires',
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
        },
      });

    } catch (error: any) {
      return res.status(error.status || 500).json({
        message: error.message || 'Erreur serveur',
      });
    }
  }

  @Roles(Role.SuperAdmin)
  @Get('stats-by-region')
  async getNumberOfLabsGroupByRegion(@Res() res) {
    try {
      const groupByRegion=await this.labsService.countLabsByRegion();
      return res.status(HttpStatus.OK).json({
        message: 'Nombre de Laboratoires par région',
        data: groupByRegion
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        message: error.message || 'Erreur serveur',
      });
    }
  }


  @Roles(Role.SuperAdmin)
  @Get('region/:regionId')
  async getLabsByRegion(@Query() query: FindLabsDto,@Param('regionId') regionId: string,@Res() res) {
    try {
      const groupByRegion=await this.labsService.findLabsByRegion(regionId,query);
      return res.status(HttpStatus.OK).json({
        message: 'Nombre de Laboratoires par région',
        data: groupByRegion
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        message: error.message || 'Erreur serveur',
      });
    }
  }


  @Get(':id')
  async findOne(@Param('id') id: string,@Res() res) {
    try {
      const lab=await this.labsService.findOne(id);
      return res.status(HttpStatus.OK).json({
        message: 'Laboratoire recupéré',
        data: lab
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        message: error.message || 'Erreur serveur',
      });
    }
  }




  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLabDto: UpdateLabDto, @Res() res) {
    try {
      logger.info(`---LABS.CONTROLLER.UPDATE INIT---`);
      const updated = await this.labsService.update(id, updateLabDto);
      logger.info(`---LABS.CONTROLLER.UPDATE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Laboratoire ${id} mis à jour`,
        data: updated
      });
    } catch (error) {
      logger.error(`---LABS.CONTROLLER.UPDATE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---LABS.CONTROLLER.REMOVE INIT---`);
      const deleted = await this.labsService.remove(id);
      logger.info(`---LABS.CONTROLLER.REMOVE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Laboratoire ${id} supprimé`,
        data: deleted
      });
    } catch (error) {
      logger.error(`---LABS.CONTROLLER.REMOVE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
