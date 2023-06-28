import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Planet } from '../../domain/models/planet.entity';
import { Repository } from 'typeorm';
import { CreatePlanetInput } from 'src/presentation/dtos/planet/create-planet.input';

@Injectable()
export class PlanetService {
  constructor(
    @InjectRepository(Planet)
    private planetRepository: Repository<Planet>,
  ) {}

  async find(): Promise<Planet[]> {
    const planets = await this.planetRepository.find();
    return planets;
  }

  async findById(id: string): Promise<Planet> {
    const user = await this.planetRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException('Planet not found');
    }
    return user;
  }

  async findByName(name: string): Promise<Planet> {
    const planet = await this.planetRepository.findOne({ where: { name } });
    if (!planet) {
      throw new NotFoundException('Planet not found');
    }
    return planet;
  }

  async create(data: CreatePlanetInput): Promise<Planet> {
    const planet = this.planetRepository.create(data);
    const planetSaved = await this.planetRepository.save(planet);

    if (!planetSaved) {
      throw new InternalServerErrorException(
        'Problem to create planet. Try again',
      );
    }

    return planetSaved;
  }
}
