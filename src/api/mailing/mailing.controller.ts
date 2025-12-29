import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { MailingService } from './mailing.service';
import {
  SendToUsersDto,
  SendToRoleDto,
  SendMailDto,
  SendMailWithRecipientsDto,
} from './dto/send-mail.dto';
import { Roles } from 'src/utils/decorators/role.decorator';
import { Role } from 'src/utils/enums/roles.enum';
import logger from 'src/utils/logger';

@Controller('mailings')
export class MailingController {
  constructor(private readonly mailingService: MailingService) {}

  /**
   * Envoie un email à des utilisateurs spécifiques (par IDs ou emails)
   */
  @Post('send-to-users')
  @Roles(Role.SuperAdmin, Role.RegionAdmin)
  @HttpCode(HttpStatus.OK)
  async sendToUsers(@Body() dto: SendToUsersDto, @Res() res) {
    try {
      logger.info(`---MAILING.CONTROLLER.SEND_TO_USERS INIT---`);
      const result = await this.mailingService.sendToUsers(dto);
      logger.info(`---MAILING.CONTROLLER.SEND_TO_USERS SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: result.message,
        data: result,
      });
    } catch (error) {
      logger.error(
        `---MAILING.CONTROLLER.SEND_TO_USERS ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  /**
   * Envoie un email à tous les directeurs de laboratoire
   */
  @Post('send-to-directors')
  @Roles(Role.SuperAdmin, Role.RegionAdmin)
  @HttpCode(HttpStatus.OK)
  async sendToDirectors(@Body() dto: SendMailDto, @Res() res) {
    try {
      logger.info(`---MAILING.CONTROLLER.SEND_TO_DIRECTORS INIT---`);
      const result = await this.mailingService.sendToDirectors(dto);
      logger.info(`---MAILING.CONTROLLER.SEND_TO_DIRECTORS SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: result.message,
        data: result,
      });
    } catch (error) {
      logger.error(
        `---MAILING.CONTROLLER.SEND_TO_DIRECTORS ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  /**
   * Envoie un email à tous les Super Admins
   */
  @Post('send-to-super-admins')
  @Roles(Role.SuperAdmin)
  @HttpCode(HttpStatus.OK)
  async sendToSuperAdmins(@Body() dto: SendMailDto, @Res() res) {
    try {
      logger.info(`---MAILING.CONTROLLER.SEND_TO_SUPER_ADMINS INIT---`);
      const result = await this.mailingService.sendToSuperAdmins(dto);
      logger.info(`---MAILING.CONTROLLER.SEND_TO_SUPER_ADMINS SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: result.message,
        data: result,
      });
    } catch (error) {
      logger.error(
        `---MAILING.CONTROLLER.SEND_TO_SUPER_ADMINS ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  /**
   * Envoie un email à tous les Lab Admins
   */
  @Post('send-to-lab-admins')
  @Roles(Role.SuperAdmin, Role.RegionAdmin)
  @HttpCode(HttpStatus.OK)
  async sendToLabAdmins(@Body() dto: SendMailDto, @Res() res) {
    try {
      logger.info(`---MAILING.CONTROLLER.SEND_TO_LAB_ADMINS INIT---`);
      const result = await this.mailingService.sendToLabAdmins(dto);
      logger.info(`---MAILING.CONTROLLER.SEND_TO_LAB_ADMINS SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: result.message,
        data: result,
      });
    } catch (error) {
      logger.error(
        `---MAILING.CONTROLLER.SEND_TO_LAB_ADMINS ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  /**
   * Envoie un email à tous les Region Admins
   */
  @Post('send-to-region-admins')
  @Roles(Role.SuperAdmin)
  @HttpCode(HttpStatus.OK)
  async sendToRegionAdmins(@Body() dto: SendMailDto, @Res() res) {
    try {
      logger.info(`---MAILING.CONTROLLER.SEND_TO_REGION_ADMINS INIT---`);
      const result = await this.mailingService.sendToRegionAdmins(dto);
      logger.info(`---MAILING.CONTROLLER.SEND_TO_REGION_ADMINS SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: result.message,
        data: result,
      });
    } catch (error) {
      logger.error(
        `---MAILING.CONTROLLER.SEND_TO_REGION_ADMINS ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  /**
   * Envoie un email à tous les utilisateurs ayant un rôle spécifique
   */
  @Post('send-to-role')
  @Roles(Role.SuperAdmin)
  @HttpCode(HttpStatus.OK)
  async sendToRole(@Body() dto: SendToRoleDto, @Res() res) {
    try {
      logger.info(`---MAILING.CONTROLLER.SEND_TO_ROLE INIT---`);
      const result = await this.mailingService.sendToRole(dto);
      logger.info(`---MAILING.CONTROLLER.SEND_TO_ROLE SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: result.message,
        data: result,
      });
    } catch (error) {
      logger.error(
        `---MAILING.CONTROLLER.SEND_TO_ROLE ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  /**
   * Envoie un email avec un objet recipients flexible
   */
  @Post('send')
  @Roles(Role.SuperAdmin, Role.RegionAdmin)
  @HttpCode(HttpStatus.OK)
  async sendWithRecipients(@Body() dto: SendMailWithRecipientsDto, @Res() res) {
    try {
      logger.info(`---MAILING.CONTROLLER.SEND_WITH_RECIPIENTS INIT---`);
      const result = await this.mailingService.sendWithRecipients(dto);
      logger.info(`---MAILING.CONTROLLER.SEND_WITH_RECIPIENTS SUCCESS---`);
      return res.status(HttpStatus.OK).json({
        message: result.message,
        data: result,
      });
    } catch (error) {
      logger.error(
        `---MAILING.CONTROLLER.SEND_WITH_RECIPIENTS ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }
}
