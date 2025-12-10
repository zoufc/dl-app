import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import logger from './utils/logger';
import { RolesGuard } from './utils/guards/role.guard';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    allowedHeaders: [
      '*',
      /* 'Content-Type, Access-Control-Allow-Origin, x-access-token, Accept', */
    ],
    methods: 'POST,GET,PUT,PATCH,DELETE',
  });
  app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const port = app.get(ConfigService).get('port');
  await app.listen(port);
  logger.info(`GESTION_PERSONNEL_BACKEND IS RUNNING ON ${await app.getUrl()}`);
}
bootstrap();
