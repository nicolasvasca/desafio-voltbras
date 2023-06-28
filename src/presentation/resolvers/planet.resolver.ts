import { Args, Query, Resolver } from '@nestjs/graphql';
import { Planet } from '../../domain/models/planet.entity';
import { PlanetService } from '../../application/services/planet.service';

@Resolver()
export class PlanetResolver {
  constructor(private planetService: PlanetService) {}

  @Query(() => [Planet])
  async suitablePlanets(): Promise<Planet[]> {
    const planets = await this.planetService.find();
    return planets;
  }

  @Query(() => Planet)
  async planet(@Args('id') id: string): Promise<Planet> {
    const planet = await this.planetService.findById(id);
    return planet;
  }
}
