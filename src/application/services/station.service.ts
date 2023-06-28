import {
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { Station } from '../../domain/models/station.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStationInput } from '../../presentation/dtos/station/create-station.input';
import { PlanetService } from 'src/application/services/planet.service';

@Injectable()
export class StationService {
  constructor(
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
    @Inject(forwardRef(() => PlanetService))
    private readonly planetService: PlanetService,
  ) {}

  async create(data: CreateStationInput): Promise<Station> {
    const planet = await this.planetService.findByName(data.planetName);
    const station = this.stationRepository.create({ name: data.name, planet });
    const stationSaved = await this.stationRepository.save(station);

    if (!stationSaved) {
      throw new InternalServerErrorException(
        'Problem to create planet. Try again',
      );
    }
    if (!planet.hasStation) {
      await this.planetService.updateHasStation(planet.id);
    }
    return stationSaved;
  }
}
