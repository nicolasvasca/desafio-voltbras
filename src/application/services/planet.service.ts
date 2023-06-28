import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Planet } from '../../domain/models/planet.entity';
import { Repository } from 'typeorm';

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
}
