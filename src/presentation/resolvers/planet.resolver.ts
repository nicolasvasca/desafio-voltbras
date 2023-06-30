import { Args, Query, Resolver } from '@nestjs/graphql';
import { Planet } from '../../domain/models/planet.entity';
import { PlanetService } from '../../application/services/planet.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../infra/security/guards/jwt-auth.guard';

@Resolver()
export class PlanetResolver {
  constructor(private planetService: PlanetService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Planet])
  async suitablePlanets(): Promise<Planet[]> {
    const planets = await this.planetService.find();
    return planets;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Planet)
  async planet(@Args('id') id: string): Promise<Planet> {
    const planet = await this.planetService.findById(id);
    return planet;
  }
}
