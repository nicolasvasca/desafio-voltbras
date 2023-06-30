import { Module, forwardRef } from '@nestjs/common';
import { ReservationService } from '../../application/services/reservation.service';
import { ReservationResolver } from '../../presentation/resolvers/reservation.resolver';
import { StationModule } from './station.module';
import { UserModule } from './user.module';
import { Reservation } from '../../domain/models/reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RechargeModule } from './recharge.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    forwardRef(() => StationModule),
    forwardRef(() => UserModule),
    forwardRef(() => RechargeModule),
  ],
  providers: [ReservationService, ReservationResolver],
})
export class ReservationModule {}
