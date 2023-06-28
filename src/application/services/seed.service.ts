import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { NasaGateway } from '../../infra/gateway/NasaGateway';
import { PlanetService } from './planet.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly nasaGateway: NasaGateway,
    @Inject(forwardRef(() => PlanetService))
    private readonly planetService: PlanetService,
  ) {}

  async run() {
    const planets = await this.planetService.find();
    if (planets.length === 0) {
      console.log('seed running, await seed over');
      const planets = await this.nasaGateway.findAllPlanets();
      Promise.all(
        planets.map(async (planet) => {
          if (planet?.pl_bmassj >= 10)
            await this.planetService.create({
              name: planet.pl_name,
              mass: planet.pl_bmassj,
            });
        }),
      );
      console.log('seed finished');
    }
  }
}
