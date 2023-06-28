import { Module } from '@nestjs/common';
import { PlanetService } from '../../application/services/planet.service';
import { PlanetResolver } from '../../presentation/resolvers/planet.resolver';
import { Planet } from '../../domain/models/planet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Planet])],
  providers: [PlanetService, PlanetResolver],
  exports: [PlanetService],
})
export class PlanetModule {}
