import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateReservationInput } from '../dtos/reservation/create-reservation.input';
import { ReservationService } from '../../application/services/reservation.service';
import { Reservation } from '../../domain/models/reservation.entity';
import { GqlAuthGuard } from 'src/infra/security/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class ReservationResolver {
  constructor(private reservationService: ReservationService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Reservation)
  async reservation(
    @Args('input') input: CreateReservationInput,
  ): Promise<Reservation> {
    const station = await this.reservationService.create(input);
    return station;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Reservation)
  async findByIdReservation(@Args('id') id: string): Promise<Reservation> {
    const user = await this.reservationService.findById(id);
    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Reservation])
  async reservations(): Promise<Reservation[]> {
    const reservations = await this.reservationService.find();
    return reservations;
  }
}
