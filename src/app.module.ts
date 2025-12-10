/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './api/auth/auth.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { LoanJobsService } from './jobs/loan-job/loan-job.service';
import { LabsModule } from './api/labs/labs.module';
import { DistrictModule } from './api/district/district.module';
import { StructureModule } from './api/structure/structure.module';
import { RegionModule } from './api/region/region.module';
import { DepartmentModule } from './api/department/department.module';
import { StructureLevelModule } from './api/structure-level/structure-level.module';
import { PostModule } from './api/post/post.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('dbUrl'),
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: Buffer.from(
          configService.get<string>('privateKey').replace(/\\n/g, '\n'), // Remplace \n par une vraie nouvelle ligne
          'utf-8',
        ),
        privateKey: Buffer.from(
          configService.get<string>('privateKey').replace(/\\n/g, '\n'), // Remplace \n par une vraie nouvelle ligne
          'utf-8',
        ),
        publicKey: Buffer.from(
          configService.get<string>('publicKey').replace(/\\n/g, '\n'), // Remplace \n par une vraie nouvelle ligne
          'utf-8',
        ),
        signOptions: {
          algorithm: 'RS256', // Utilisation de l'algorithme RS256 pour la signature avec clé privée
          expiresIn: '1d', // Expiration : 1 jour
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    UserModule,
    LabsModule,
    DistrictModule,
    StructureModule,
    RegionModule,
    DepartmentModule,
    StructureLevelModule,
    PostModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, LoanJobsService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST }, // Exclure les routes de connexion
        { path: 'auth/register', method: RequestMethod.POST }, // Exclure les routes d'inscription
        { path: 'post', method: RequestMethod.GET },
      )
      .forRoutes('*'); // Appliquer à toutes les routes sauf exclusions
  }
}
