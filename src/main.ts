import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './application/services/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const seedsService = app.get(SeedService);
  seedsService.run();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
