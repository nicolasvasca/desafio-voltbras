import { Module, forwardRef } from '@nestjs/common';
import { StationService } from '../../application/services/station.service';
import { StationResolver } from '../../presentation/resolvers/station.resolver';
import { Station } from '../../domain/models/station.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanetModule } from './planet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Station]),
    forwardRef(() => PlanetModule),
  ],
  providers: [StationService, StationResolver],
  exports: [StationService],
})
export class StationModule {}
