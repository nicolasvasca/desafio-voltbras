import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StationService } from './station.service';
import { UserService } from './user.service';
import { Reservation } from '../../domain/models/reservation.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateReservationInput } from '../../presentation/dtos/reservation/create-reservation.input';
import VerifyDate from '../../utils/helpers/verify-date';
import { RechargeService } from './recharge.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @Inject(forwardRef(() => StationService))
    private readonly stationService: StationService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => RechargeService))
    private readonly rechargeService: RechargeService,
  ) {}

  async create(data: CreateReservationInput): Promise<Reservation> {
    const user = await this.userService.findById(data.userId);
    const station = await this.stationService.findById(data.stationId);
    const started = new Date(data.start);

    if (!VerifyDate.isAValidDateToReservation(new Date(), started)) {
      throw new BadRequestException('This date is not valid');
    }

    const finished = new Date(started.getTime() + 60 * 60 * 1000);

    const stationHasReservation = await this.reservationRepository.findOne({
      where: [
        {
          station: { id: station.id },
          started: LessThanOrEqual(started),
          finished: MoreThanOrEqual(started),
        },
        {
          station: { id: station.id },
          started: LessThanOrEqual(finished),
          finished: MoreThanOrEqual(finished),
        },
      ],
    });

    if (stationHasReservation) {
      throw new BadRequestException('Station already has reservation');
    }

    const userHasReservation = await this.reservationRepository.findOne({
      where: [
        {
          user: { id: user.id },
          started: LessThanOrEqual(started),
          finished: MoreThanOrEqual(started),
        },
        {
          user: { id: user.id },
          started: LessThanOrEqual(finished),
          finished: MoreThanOrEqual(finished),
        },
      ],
    });

    if (userHasReservation) {
      throw new BadRequestException('User already has reservation');
    }

    const recharge = this.reservationRepository.create({
      started,
      finished,
      user,
      station,
    });

    const reservationSaved = await this.reservationRepository.save(recharge);

    if (!reservationSaved) {
      throw new InternalServerErrorException(
        'Problem to create a recharge. Try again',
      );
    }
    return reservationSaved;
  }

  async findById(id: string): Promise<Reservation> {
    const recharge = await this.reservationRepository.findOne({
      where: { id },
      relations: {
        user: true,
        station: true,
        recharge: true,
      },
    });
    if (!recharge) {
      throw new NotFoundException('Reservation not found');
    }
    return recharge;
  }

  async find(): Promise<Reservation[]> {
    const reservations = await this.reservationRepository.find({
      relations: {
        user: true,
        station: true,
        recharge: true,
      },
    });
    return reservations;
  }

  async updateRecharge(id: string, rechargeId: string): Promise<Reservation> {
    const recharge = await this.rechargeService.findById(rechargeId);
    const reservation = await this.findById(id);

    await this.reservationRepository.update(reservation, { recharge });

    const reservationUpdated = this.reservationRepository.create({
      ...reservation,
      recharge,
    });

    return reservationUpdated;
  }
}
