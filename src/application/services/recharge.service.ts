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

@Injectable()
export class RechargeService {
  constructor(
    @InjectRepository(Recharge)
    private rechargeRepository: Repository<Recharge>,
    @Inject(forwardRef(() => StationService))
    private readonly stationService: StationService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(data: CreateRechargeInput): Promise<Recharge> {
    const user = await this.userService.findById(data.userId);
    const station = await this.stationService.findById(data.stationId);
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

    const finished = new Date(started.getTime() + 60 * 60 * 1000);
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
