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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProfessionalExperienceService } from './professional-experience.service';
import { CreateProfessionalExperienceDto } from './dto/create-professional-experience.dto';
import { UpdateProfessionalExperienceDto } from './dto/update-professional-experience.dto';
import logger from 'src/utils/logger';
import { UploadHelper } from 'src/utils/functions/upload-image.helper';
import { TrainingService } from '../training/training.service';

@Controller('professional-experiences')
export class ProfessionalExperienceController {
  constructor(
    private readonly professionalExperienceService: ProfessionalExperienceService,
    private readonly trainingService: TrainingService,
  ) {}

  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({ destination: UploadHelper.uploadDirectory }),
    }),
  )
  @Post()
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createProfessionalExperienceDto: CreateProfessionalExperienceDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      logger.info(`---PROFESSIONAL_EXPERIENCE.CONTROLLER.CREATE INIT---`);
      const requesterId = req.user._id || req.user.userId || req.user.id;
      const requesterRole = req.user.role;
      const experience = await this.professionalExperienceService.create(
        createProfessionalExperienceDto,
        requesterId,
        requesterRole,
        files || [],
      );
      logger.info(`---PROFESSIONAL_EXPERIENCE.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json({
        message: 'Expérience professionnelle créée avec succès',
        data: experience,
      });
    } catch (error) {
      logger.error(
        `---PROFESSIONAL_EXPERIENCE.CONTROLLER.CREATE ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Get()
  async findAll(
    @Query()
    query: {
      page?: number;
      limit?: number;
      user?: string;
      companyName?: string;
    },
    @Res() res,
  ) {
    try {
      logger.info(`---PROFESSIONAL_EXPERIENCE.CONTROLLER.FIND_ALL INIT---`);
      const result = await this.professionalExperienceService.findAll(query);
      logger.info(`---PROFESSIONAL_EXPERIENCE.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: 'Liste des expériences professionnelles',
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      logger.error(
        `---PROFESSIONAL_EXPERIENCE.CONTROLLER.FIND_ALL ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Get('my-cv')
  async getMyCv(@Req() req, @Res() res) {
    try {
      const userId = req.user._id || req.user.userId || req.user.id;
      logger.info(
        `---PROFESSIONAL_EXPERIENCE.CONTROLLER.GET_MY_CV INIT--- userId=${userId}`,
      );

      // Récupérer les expériences professionnelles
      const experiencesResult =
        await this.professionalExperienceService.findAll({
          user: userId,
          limit: 1000,
        });

      // Récupérer les formations
      const trainingsResult = await this.trainingService.findAll({
        user: userId,
        limit: 1000,
      });

      logger.info(
        `---PROFESSIONAL_EXPERIENCE.CONTROLLER.GET_MY_CV SUCCESS--- userId=${userId}`,
      );
      return res.status(HttpStatus.OK).json({
        message: 'CV récupéré avec succès',
        data: {
          experiences: experiencesResult.data,
          trainings: trainingsResult.data,
        },
      });
    } catch (error) {
      logger.error(
        `---PROFESSIONAL_EXPERIENCE.CONTROLLER.GET_MY_CV ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Get('my-experiences')
  async getMyExperiences(
    @Req() req,
    @Query()
    query: {
      page?: number;
      limit?: number;
      companyName?: string;
    },
    @Res() res,
  ) {
    try {
      const userId = req.user._id || req.user.userId || req.user.id;
      logger.info(
        `---PROFESSIONAL_EXPERIENCE.CONTROLLER.GET_MY_EXPERIENCES INIT--- userId=${userId}`,
      );

      const result = await this.professionalExperienceService.findAll({
        ...query,
        user: userId,
      });

      logger.info(
        `---PROFESSIONAL_EXPERIENCE.CONTROLLER.GET_MY_EXPERIENCES SUCCESS--- userId=${userId}`,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Mes expériences professionnelles',
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      logger.error(
        `---PROFESSIONAL_EXPERIENCE.CONTROLLER.GET_MY_EXPERIENCES ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Get('cv/:userId')
  async getUserCv(@Param('userId') userId: string, @Res() res) {
    try {
      logger.info(
        `---PROFESSIONAL_EXPERIENCE.CONTROLLER.GET_USER_CV INIT--- userId=${userId}`,
      );

      // Récupérer les expériences professionnelles
      const experiencesResult =
        await this.professionalExperienceService.findAll({
          user: userId,
          limit: 1000,
        });

      // Récupérer les formations
      const trainingsResult = await this.trainingService.findAll({
        user: userId,
        limit: 1000,
      });

      logger.info(
        `---PROFESSIONAL_EXPERIENCE.CONTROLLER.GET_USER_CV SUCCESS--- userId=${userId}`,
      );
      return res.status(HttpStatus.OK).json({
        message: 'CV récupéré avec succès',
        data: {
          experiences: experiencesResult.data,
          trainings: trainingsResult.data,
        },
      });
    } catch (error) {
      logger.error(
        `---PROFESSIONAL_EXPERIENCE.CONTROLLER.GET_USER_CV ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      logger.info(
        `---PROFESSIONAL_EXPERIENCE.CONTROLLER.FIND_ONE INIT--- id=${id}`,
      );
      const experience = await this.professionalExperienceService.findOne(id);
      logger.info(
        `---PROFESSIONAL_EXPERIENCE.CONTROLLER.FIND_ONE SUCCESS--- id=${id}`,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Expérience professionnelle récupérée avec succès',
        data: experience,
      });
    } catch (error) {
      logger.error(
        `---PROFESSIONAL_EXPERIENCE.CONTROLLER.FIND_ONE ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({ destination: UploadHelper.uploadDirectory }),
    }),
  )
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateProfessionalExperienceDto: UpdateProfessionalExperienceDto,
    @Res() res,
  ) {
    try {
      logger.info(
        `---PROFESSIONAL_EXPERIENCE.CONTROLLER.UPDATE INIT--- id=${id}`,
      );
      const updated = await this.professionalExperienceService.update(
        id,
        updateProfessionalExperienceDto,
        files || [],
      );
      logger.info(
        `---PROFESSIONAL_EXPERIENCE.CONTROLLER.UPDATE SUCCESS--- id=${id}`,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Expérience professionnelle mise à jour avec succès',
        data: updated,
      });
    } catch (error) {
      logger.error(
        `---PROFESSIONAL_EXPERIENCE.CONTROLLER.UPDATE ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      logger.info(
        `---PROFESSIONAL_EXPERIENCE.CONTROLLER.REMOVE INIT--- id=${id}`,
      );
      const deleted = await this.professionalExperienceService.remove(id);
      logger.info(
        `---PROFESSIONAL_EXPERIENCE.CONTROLLER.REMOVE SUCCESS--- id=${id}`,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Expérience professionnelle supprimée avec succès',
        data: deleted,
      });
    } catch (error) {
      logger.error(
        `---PROFESSIONAL_EXPERIENCE.CONTROLLER.REMOVE ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }
}
