import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AmmImportService } from './amm-import.service';
import { CreateAmmImportDto } from './dto/create-amm-import.dto';
import { UpdateAmmImportDto } from './dto/update-amm-import.dto';
import { UploadHelper } from 'src/utils/functions/upload-image.helper';
import { parseBody } from '../shared/utils';

@Controller('amm-imports')
export class AmmImportController {
  constructor(private readonly ammImportService: AmmImportService) {}

  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({ destination: UploadHelper.uploadDirectory }),
    }),
  )
  @Post()
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateAmmImportDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      const request = await this.ammImportService.create(
        body,
        req.user?._id || null,
        files || [],
      );
      return res.status(HttpStatus.CREATED).json({
        message: 'Demande AMM Import créée avec succès',
        data: request,
      });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error);
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      const requests = await this.ammImportService.findAll('AMM_IMPORT');
      return res.status(HttpStatus.OK).json({
        message: 'Liste des demandes AMM Import',
        data: requests,
      });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const request = await this.ammImportService.findOne(id);
      if (request.type !== 'AMM_IMPORT') {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: "Cette demande n'est pas une demande d'importation AMM",
        });
      }
      return res.status(HttpStatus.OK).json({
        message: `Demande AMM Import ${id}`,
        data: request,
      });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAmmImportDto,
    @Res() res,
  ) {
    try {
      const updated = await this.ammImportService.update(id, dto);
      return res.status(HttpStatus.OK).json({
        message: `Demande AMM Import ${id} mise à jour`,
        data: updated,
      });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const deleted = await this.ammImportService.remove(id);
      return res.status(HttpStatus.OK).json({
        message: `Demande AMM Import ${id} supprimée`,
        data: deleted,
      });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error);
    }
  }
}
