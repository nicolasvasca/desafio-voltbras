import { Module, forwardRef } from '@nestjs/common';
import { RechargeService } from '../../application/services/recharge.service';
import { RechargeResolver } from '../../presentation/resolvers/recharge.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recharge } from '../../domain/models/recharge.entity';
import { StationModule } from './station.module';
import { UserModule } from './user.module';
import { ReservationModule } from './reservation.module';

@Module({
  imports: [
    forwardRef(() => StationModule),
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([Recharge]),
    forwardRef(() => ReservationModule),
  ],
  providers: [RechargeService, RechargeResolver],
  exports: [RechargeService],
})
export class RechargeModule {}
