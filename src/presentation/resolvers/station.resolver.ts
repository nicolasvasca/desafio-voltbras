import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StationService } from '../../application/services/station.service';
import { Station } from '../../domain/models/station.entity';
import { CreateStationInput } from '../dtos/station/create-station.input';

@Resolver()
export class StationResolver {
  constructor(private stationService: StationService) {}

  @Mutation(() => Station)
  async installStation(
    @Args('input') input: CreateStationInput,
  ): Promise<Station> {
    const station = await this.stationService.create(input);
    return station;
  }

  @Query(() => [Station])
  async stations(): Promise<Station[]> {
    const stations = await this.stationService.find();
    return stations;
  }
}
