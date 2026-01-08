import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AlertStatus, AlertType } from 'src/api/alerts/schemas/alert.schema';
import { MaintenanceSchedule } from 'src/api/maintenance_schedules/entities/maintenance_schedule.entity';
import { Equipment } from 'src/api/equipments/interfaces/equipment.interface';
import { MailService } from 'src/providers/mail-service/mail.service';
import logger from 'src/utils/logger';

@Injectable()
export class AlertsJobService {
  constructor(
    @InjectModel('Alert') private alertModel: Model<any>,
    @InjectModel('MaintenanceSchedule')
    private maintenanceScheduleModel: Model<MaintenanceSchedule>,
    @InjectModel('Equipment') private equipmentModel: Model<Equipment>,
    private mailService: MailService,
  ) {}

  /**
   * Vérifie les maintenances prévues dans les 7 prochains jours
   * S'exécute tous les jours à minuit
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkMaintenanceSchedules() {
    try {
      logger.info('---ALERTS_JOB.CHECK_MAINTENANCE_SCHEDULES INIT---');

      const inSevenDays = new Date();
      inSevenDays.setDate(inSevenDays.getDate() + 7);

      const upcomingMaintenances = await this.maintenanceScheduleModel
        .find({
          nextMaintenanceDate: { $lte: inSevenDays, $gte: new Date() },
          active: true,
        })
        .populate('equipment')
        .populate('assignedTo', 'firstname lastname phoneNumber email')
        .exec();

      for (const schedule of upcomingMaintenances) {
        // Vérifier si une alerte existe déjà pour ce planning et cette date
        const existingAlert = await this.alertModel.findOne({
          type: AlertType.MAINTENANCE_REMINDER,
          relatedId: schedule._id,
          created_at: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        });

        if (!existingAlert) {
          await this.alertModel.create({
            type: AlertType.MAINTENANCE_REMINDER,
            title: 'Rappel de Maintenance',
            message: `Une maintenance ${
              schedule.maintenanceType
            } est prévue pour l'équipement ${
              schedule.equipment?.name
            } le ${schedule.nextMaintenanceDate.toLocaleDateString()}.`,
            recipient: schedule.assignedTo?._id,
            relatedId: schedule._id,
            status: AlertStatus.PENDING,
          });
        }
      }

      logger.info(
        `---ALERTS_JOB.CHECK_MAINTENANCE_SCHEDULES SUCCESS: ${upcomingMaintenances.length} checked---`,
      );
    } catch (error) {
      logger.error(
        `---ALERTS_JOB.CHECK_MAINTENANCE_SCHEDULES ERROR: ${error.message}---`,
      );
    }
  }

  /**
   * Envoie les emails pour les alertes en attente
   * S'exécute toutes les heures
   */
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async processPendingAlerts() {
    try {
      logger.info('---ALERTS_JOB.PROCESS_PENDING_ALERTS INIT---');

      const pendingAlerts = await this.alertModel
        .find({ status: AlertStatus.PENDING })
        .populate('recipient', 'firstname lastname phoneNumber email')
        .limit(50) // Traiter par lots
        .exec();

      for (const alert of pendingAlerts) {
        try {
          if (alert.recipient?.email) {
            await this.mailService.sendMail({
              to: alert.recipient.email,
              subject: alert.title,
              text: alert.message,
              html: `<p>${alert.message}</p>`,
            } as any);

            alert.status = AlertStatus.SENT;
            alert.sentAt = new Date();
            await alert.save();
          } else {
            // Pas d'email pour le destinataire
            alert.status = AlertStatus.FAILED;
            await alert.save();
          }
        } catch (mailError) {
          logger.error(
            `---ALERTS_JOB.SEND_MAIL ERROR for alert ${alert._id}: ${mailError.message}---`,
          );
          alert.status = AlertStatus.FAILED;
          await alert.save();
        }
      }

      logger.info(
        `---ALERTS_JOB.PROCESS_PENDING_ALERTS SUCCESS: ${pendingAlerts.length} processed---`,
      );
    } catch (error) {
      logger.error(
        `---ALERTS_JOB.PROCESS_PENDING_ALERTS ERROR: ${error.message}---`,
      );
    }
  }
}
