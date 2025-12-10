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
  Query,
  Req,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateLabStaffDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import logger from 'src/utils/logger';
import { Roles } from 'src/utils/decorators/role.decorator';
import { Role } from 'src/utils/enums/roles.enum';
import { FindUsersDto } from './dto/find-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.SuperAdmin)
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Req() req, @Res() res) {
    try {
      logger.info(`---USER.CONTROLLER.CREATE INIT---`);
      const user = await this.userService.create(createUserDto);
      logger.info(`---USER.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      logger.error(`---USER.CONTROLLER.CREATE ERROR ${error}---`);
      return res.status(error.status).json(error);
    }
  }

  @Roles(Role.LabAdmin)
  @Post('create-lab-staff')
  async createLabStaff(@Body() createUserDto: CreateLabStaffDto, @Req() req, @Res() res) {
    try {
      const labId=req.user.lab.toString()
      createUserDto.lab=labId
      logger.info(`---USER.CONTROLLER.CREATE INIT---`);
      const user = await this.userService.create(createUserDto);
      logger.info(`---USER.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      logger.error(`---USER.CONTROLLER.CREATE ERROR ${error}---`);
      return res.status(error.status).json(error);
    }
  }

  @Roles(Role.SuperAdmin,Role.LabAdmin,Role.LabStaff)
  @Get()
  async findAll(
    @Query() query: FindUsersDto,
    @Req() req,
    @Res() res
  ) {
    try {
      const labId=req.user.lab
      if(labId)
      {
        query.lab=labId
      }
      const result = await this.userService.findAll(query);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des utilisateurs',
        data: result.data,
        pagination: {
          total: result.total,
          page: parseInt(result.page),
          limit:parseInt(result.limit),
          totalPages: result.totalPages,
        },
      });
    } catch (error: any) {
      return res.status(error.status || 500).json({
        message: error.message || 'Erreur serveur',
      });
    }
  }


  //@Roles(Role.SuperAdmin)
  @Get(':userId')
  async findOne(@Param('userId') userId: string, @Req() req, @Res() res) {
    try {
      logger.info(`---USER.CONTROLLER.FIND_ONE INIT---`);
      const requester=req.user
      const user = await this.userService.findOne(userId);
      if(!this.userService.isSuperAdminOrLabAdmin(requester,user.lab?._id))
      {
        throw new HttpException("Vous n'avez pas le droit de consulter cet utilisateur!",HttpStatus.UNAUTHORIZED)
      }
      logger.info(`---USER.CONTROLLER.FIND_ONE SUCCESS---`);
      return res.status(HttpStatus.OK).json({message: `Utilisateur ${userId}`,data: user});
    } catch (error) {
      logger.error(`---USER.CONTROLLER.FIND_ONE ERROR ${error}---`);
      return res.status(error.status).json(error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res) {
    try {
      logger.info(`---USER.CONTROLLER.UPDATE INIT---`);
      const updated = await this.userService.update(id, updateUserDto);
      logger.info(`---USER.CONTROLLER.UPDATE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Utilisateur ${id} mis à jour`,
        data: updated
      });
    } catch (error) {
      logger.error(`---USER.CONTROLLER.UPDATE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(`---USER.CONTROLLER.REMOVE INIT---`);
      const deleted = await this.userService.remove(id);
      logger.info(`---USER.CONTROLLER.REMOVE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: `Utilisateur ${id} supprimé`,
        data: deleted
      });
    } catch (error) {
      logger.error(`---USER.CONTROLLER.REMOVE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
