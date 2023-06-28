import { Module, forwardRef } from '@nestjs/common';
import { SeedService } from '../../application/services/seed.service';
import { PlanetModule } from './planet.module';
import { NasaGateway } from '../gateway/NasaGateway';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, forwardRef(() => PlanetModule)],
  providers: [SeedService, NasaGateway],
  exports: [SeedService],
})
export class SeedModule {}
