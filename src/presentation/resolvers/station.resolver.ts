import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StationService } from '../../application/services/station.service';
import { Station } from '../../domain/models/station.entity';
import { CreateStationInput } from '../dtos/station/create-station.input';
import { GqlAuthGuard } from '../../infra/security/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class StationResolver {
  constructor(private stationService: StationService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Station)
  async installStation(
    @Args('input') input: CreateStationInput,
  ): Promise<Station> {
    const station = await this.stationService.create(input);
    return station;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Station])
  async stations(): Promise<Station[]> {
    const stations = await this.stationService.find();
    return stations;
  }
}
