import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Station } from '../../domain/models/station.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStationInput } from '../../presentation/dtos/station/create-station.input';
import { PlanetService } from './planet.service';

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
        'Problem to create a station. Try again',
      );
    }
    if (!planet.hasStation) {
      const updatedPlanet = await this.planetService.updateHasStation(
        planet.id,
      );
      if (!updatedPlanet) {
        throw new InternalServerErrorException(
          'Problem to update Planet. Try again',
        );
      }
    }
    return stationSaved;
  }

  async find(): Promise<Station[]> {
    const station = await this.stationRepository.find({
      relations: {
        planet: true,
      },
    });
    return station;
  }

  async findById(id: string): Promise<Station> {
    const station = await this.stationRepository.findOne({ where: { id } });
    if (!station) {
      throw new NotFoundException('Station not found');
    }
    return station;
  }
}
