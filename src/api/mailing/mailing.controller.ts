import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MailingService } from './mailing.service';
import {
  SendToUsersDto,
  SendToRoleDto,
  SendMailDto,
} from './dto/send-mail.dto';
import { Roles } from 'src/utils/decorators/role.decorator';
import { Role } from 'src/utils/enums/roles.enum';

@Controller('mailings')
export class MailingController {
  constructor(private readonly mailingService: MailingService) {}

  /**
   * Envoie un email à des utilisateurs spécifiques (par IDs ou emails)
   */
  @Post('send-to-users')
  @Roles(Role.SuperAdmin, Role.RegionAdmin)
  @HttpCode(HttpStatus.OK)
  async sendToUsers(@Body() dto: SendToUsersDto) {
    return this.mailingService.sendToUsers(dto);
  }

  /**
   * Envoie un email à tous les directeurs de laboratoire
   */
  @Post('send-to-directors')
  @Roles(Role.SuperAdmin, Role.RegionAdmin)
  @HttpCode(HttpStatus.OK)
  async sendToDirectors(@Body() dto: SendMailDto) {
    return this.mailingService.sendToDirectors(dto);
  }

  /**
   * Envoie un email à tous les Super Admins
   */
  @Post('send-to-super-admins')
  @Roles(Role.SuperAdmin)
  @HttpCode(HttpStatus.OK)
  async sendToSuperAdmins(@Body() dto: SendMailDto) {
    return this.mailingService.sendToSuperAdmins(dto);
  }

  /**
   * Envoie un email à tous les Lab Admins
   */
  @Post('send-to-lab-admins')
  @Roles(Role.SuperAdmin, Role.RegionAdmin)
  @HttpCode(HttpStatus.OK)
  async sendToLabAdmins(@Body() dto: SendMailDto) {
    return this.mailingService.sendToLabAdmins(dto);
  }

  /**
   * Envoie un email à tous les Region Admins
   */
  @Post('send-to-region-admins')
  @Roles(Role.SuperAdmin)
  @HttpCode(HttpStatus.OK)
  async sendToRegionAdmins(@Body() dto: SendMailDto) {
    return this.mailingService.sendToRegionAdmins(dto);
  }

  /**
   * Envoie un email à tous les utilisateurs ayant un rôle spécifique
   */
  @Post('send-to-role')
  @Roles(Role.SuperAdmin)
  @HttpCode(HttpStatus.OK)
  async sendToRole(@Body() dto: SendToRoleDto) {
    return this.mailingService.sendToRole(dto);
  }
}
