import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recharge } from '../../domain/models/recharge.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { StationService } from './station.service';
import { UserService } from './user.service';
import { CreateRechargeInput } from '../../presentation/dtos/recharge/create-recharge.input';
import { ReservationService } from './reservation.service';
import VerifyDate from '../../utils/helpers/verify-date';

@Injectable()
export class RechargeService {
  constructor(
    @InjectRepository(Recharge)
    private rechargeRepository: Repository<Recharge>,
    @Inject(forwardRef(() => StationService))
    private readonly stationService: StationService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => ReservationService))
    private readonly reservationService: ReservationService,
  ) {}

  async create(data: CreateRechargeInput): Promise<Recharge> {
    let reservation = data?.reservationId
      ? await this.reservationService.findById(data.reservationId)
      : null;

    if (
      reservation &&
      !VerifyDate.isAValidReservationDate(new Date(), reservation)
    ) {
      throw new BadRequestException('The reservation is not valid!');
    }

    const user = await this.userService.findById(
      reservation ? reservation.user.id : data.userId,
    );
    const station = await this.stationService.findById(
      reservation ? reservation.station.id : data.stationId,
    );
    const started = new Date();
    const userRechargeInProgress = await this.rechargeRepository.findOne({
      where: { user: { id: user.id }, finished: MoreThanOrEqual(started) },
    });
    if (userRechargeInProgress) {
      throw new BadRequestException('User already has recharge in progress');
    }
    const stationRechargeInProgress = await this.rechargeRepository.findOne({
      where: {
        station: { id: station.id },
        finished: MoreThanOrEqual(started),
      },
    });
    if (stationRechargeInProgress) {
      throw new BadRequestException('Station already has recharge in progress');
    }
    let finished = reservation
      ? reservation.finished
      : new Date(started.getTime() + 60 * 60 * 1000);

    const stationReservation = reservation
      ? reservation
      : await this.reservationService.findOneStationReservation(
          station.id,
          started,
          finished,
        );

    if (stationReservation && !reservation) {
      if (stationReservation.user.id !== user.id) {
        if (stationReservation.started > started) {
          finished = stationReservation.started;
        } else {
          throw new BadRequestException(
            'Station already has reservation for another user',
          );
        }
      } else if (stationReservation.user.id === user.id) {
        if (stationReservation.started > started) {
          finished = new Date(started.getTime() + 60 * 60 * 1000);
          reservation = await this.reservationService.updateInterval(
            stationReservation.id,
            started,
            finished,
          );
        }
      }
    }
    const recharge = this.rechargeRepository.create({
      started,
      finished,
      user,
      station,
    });
    const rechargeSaved = await this.rechargeRepository.save(recharge);

    if (!rechargeSaved) {
      throw new InternalServerErrorException(
        'Problem to create a recharge. Try again',
      );
    }
    reservation
      ? await this.reservationService.updateRecharge(
          reservation.id,
          rechargeSaved.id,
        )
      : null;

    return rechargeSaved;
  }

  async findById(id: string): Promise<Recharge> {
    const recharge = await this.rechargeRepository.findOne({ where: { id } });
    if (!recharge) {
      throw new NotFoundException('Recharge not found');
    }
    return recharge;
  }

  async updateFinishedRecharge(id: string): Promise<Recharge> {
    const recharge = await this.findById(id);

    await this.rechargeRepository.update(recharge, { finished: new Date() });

    const rechargeUpdated = this.rechargeRepository.create({
      ...recharge,
      finished: new Date(),
    });

    return rechargeUpdated;
  }

  async stationHistory(stationId: string): Promise<Recharge[]> {
    const recharges = await this.rechargeRepository.find({
      where: {
        station: { id: stationId },
      },
      relations: {
        user: true,
      },
    });
    return recharges;
  }
}
