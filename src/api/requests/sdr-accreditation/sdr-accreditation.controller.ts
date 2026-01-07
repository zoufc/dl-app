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
import { SdrAccreditationService } from './sdr-accreditation.service';
import { CreateSdrAccreditationDto } from './dto/create-sdr-accreditation.dto';
import { UpdateSdrAccreditationDto } from './dto/update-sdr-accreditation.dto';
import { UploadHelper } from 'src/utils/functions/upload-image.helper';
import { parseBody } from '../shared/utils';

@Controller('sdr-accreditations')
export class SdrAccreditationController {
  constructor(private readonly service: SdrAccreditationService) {}

  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({ destination: UploadHelper.uploadDirectory }),
    }),
  )
  @Post()
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
    @Req() req,
    @Res() res,
  ) {
    try {
      const dto = parseBody(body) as CreateSdrAccreditationDto;
      const request = await this.service.create(
        dto,
        req.user?._id || null,
        files || [],
      );
      return res.status(HttpStatus.CREATED).json({
        message: 'Demande SDR Accreditation créée avec succès',
        data: request,
      });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      const requests = await this.service.findAll('SDR_ACCREDITATION');
      return res.status(HttpStatus.OK).json({
        message: 'Liste des demandes SDR Accreditation',
        data: requests,
      });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const request = await this.service.findOne(id);
      if (request.type !== 'SDR_ACCREDITATION') {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: "Cette demande n'est pas une demande d'agrément SDR",
        });
      }
      return res.status(HttpStatus.OK).json({
        message: `Demande SDR Accreditation ${id}`,
        data: request,
      });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSdrAccreditationDto,
    @Res() res,
  ) {
    try {
      const updated = await this.service.update(id, dto);
      return res.status(HttpStatus.OK).json({
        message: `Demande SDR Accreditation ${id} mise à jour`,
        data: updated,
      });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const deleted = await this.service.remove(id);
      return res.status(HttpStatus.OK).json({
        message: `Demande SDR Accreditation ${id} supprimée`,
        data: deleted,
      });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
