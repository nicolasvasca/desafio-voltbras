import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Recharge } from '../../domain/models/recharge.entity';
import { RechargeService } from '../../application/services/recharge.service';
import { CreateRechargeInput } from '../dtos/recharge/create-recharge.input';

@Resolver()
export class RechargeResolver {
  constructor(private rechargeService: RechargeService) {}

  @Mutation(() => Recharge)
  async recharge(@Args('input') input: CreateRechargeInput): Promise<Recharge> {
    const station = await this.rechargeService.create(input);
    return station;
  }

  @Mutation(() => Recharge)
  async finishRecharge(@Args('id') id: string): Promise<Recharge> {
    const station = await this.rechargeService.updateFinishedRecharge(id);
    return station;
  }

  @Query(() => [Recharge])
  async stationHistory(
    @Args('stationId') stationId: string,
  ): Promise<Recharge[]> {
    const recharges = await this.rechargeService.stationHistory(stationId);
    return recharges;
  }
}
