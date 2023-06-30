import { Test, TestingModule } from '@nestjs/testing';
import { RechargeService } from '../../src/application/services/recharge.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Recharge } from '../../src/domain/models/recharge.entity';
import { StationService } from '../../src/application/services/station.service';
import { UserService } from '../../src/application/services/user.service';
import { User } from '../../src/domain/models/user.entity';
import { Station } from '../../src/domain/models/station.entity';
import { Planet } from '../../src/domain/models/planet.entity';
import { PlanetService } from '../../src/application/services/planet.service';
import MockRepository from './__mocks__/mock-repository';
import MockRecharge from './__mocks__/mock-recharge';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ReservationService } from '../../src/application/services/reservation.service';
import { Reservation } from '../../src/domain/models/reservation.entity';
import MockReservation from './__mocks__/mock-reservation';

describe('RechargeService', () => {
  let service: RechargeService;
  let mockRepository = MockRepository.mockRepository();
  let mockStationRepository = MockRepository.mockRepository();
  let mockUserRepository = MockRepository.mockRepository();
  let mockPlanetRepository = MockRepository.mockRepository();
  let mockReservationRepository = MockRepository.mockRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RechargeService,
        UserService,
        StationService,
        PlanetService,
        ReservationService,
        {
          provide: getRepositoryToken(Recharge),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Station),
          useValue: mockStationRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Planet),
          useValue: mockPlanetRepository,
        },
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockReservationRepository,
        },
      ],
    }).compile();

    service = module.get<RechargeService>(RechargeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  beforeEach(() => {
    mockRepository = MockRepository.resetMocks(mockRepository);
    mockStationRepository = MockRepository.resetMocks(mockStationRepository);
    mockUserRepository = MockRepository.resetMocks(mockUserRepository);
    mockPlanetRepository = MockRepository.resetMocks(mockPlanetRepository);
    mockReservationRepository = MockRepository.resetMocks(
      mockReservationRepository,
    );
  });

  describe('When create recharge', () => {
    it('should create a recharge', async () => {
      const recharge = MockRecharge.mockRecharge();
      mockStationRepository.findOne.mockReturnValue(recharge.station);
      mockUserRepository.findOne.mockReturnValue(recharge.user);
      mockRepository.findOne.mockReturnValue(null);
      mockRepository.save.mockReturnValue(recharge);
      mockRepository.create.mockReturnValue(recharge);

      const savedRecharge = await service.create({
        stationId: recharge.station.id,
        userId: recharge.user.id,
      });

      expect(savedRecharge).toMatchObject(recharge);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });

    it('should return a exception when doesnt create a recharge', async () => {
      const recharge = MockRecharge.mockRecharge();
      mockStationRepository.findOne.mockReturnValue(recharge.station);
      mockUserRepository.findOne.mockReturnValue(recharge.user);
      mockRepository.findOne.mockReturnValue(null);
      mockRepository.save.mockReturnValue(null);
      mockRepository.create.mockReturnValue(recharge);

      await service
        .create({
          stationId: recharge.station.id,
          userId: recharge.user.id,
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(InternalServerErrorException);
          expect(e).toMatchObject({
            message: 'Problem to create a recharge. Try again',
          });
        });
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
    it('should return a exception when doesnt find a station', async () => {
      const recharge = MockRecharge.mockRecharge();
      mockStationRepository.findOne.mockReturnValue(null);
      mockUserRepository.findOne.mockReturnValue(recharge.user);
      mockRepository.findOne.mockReturnValue(null);
      mockRepository.save.mockReturnValue(recharge);
      mockRepository.create.mockReturnValue(recharge);

      await service
        .create({
          stationId: recharge.station.id,
          userId: recharge.user.id,
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e).toMatchObject({
            message: 'Station not found',
          });
        });
      expect(mockStationRepository.findOne).toBeCalledTimes(1);
    });

    it('should return a exception when doesnt find a user', async () => {
      const recharge = MockRecharge.mockRecharge();
      mockStationRepository.findOne.mockReturnValue(recharge.station);
      mockUserRepository.findOne.mockReturnValue(null);
      mockRepository.findOne.mockReturnValue(null);
      mockRepository.save.mockReturnValue(recharge);
      mockRepository.create.mockReturnValue(recharge);

      await service
        .create({
          stationId: recharge.station.id,
          userId: recharge.user.id,
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e).toMatchObject({
            message: 'User not found',
          });
        });
      expect(mockUserRepository.findOne).toBeCalledTimes(1);
    });

    it('should return a exception when have a recharge in progress', async () => {
      const recharge = MockRecharge.mockRecharge();
      mockStationRepository.findOne.mockReturnValue(recharge.station);
      mockUserRepository.findOne.mockReturnValue(recharge.user);
      mockRepository.findOne.mockReturnValue(recharge);
      mockRepository.save.mockReturnValue(recharge);
      mockRepository.create.mockReturnValue(recharge);

      await service
        .create({
          stationId: recharge.station.id,
          userId: recharge.user.id,
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(BadRequestException);
        });
      expect(mockUserRepository.findOne).toBeCalledTimes(1);
    });
    it('should reservation is invalid', async () => {
      const reservation = MockReservation.mockReservation();
      const recharge = MockRecharge.mockRecharge();
      mockStationRepository.findOne.mockReturnValue(recharge.station);
      mockUserRepository.findOne.mockReturnValue(recharge.user);
      mockRepository.findOne.mockReturnValue(null);
      mockRepository.save.mockReturnValue(recharge);
      mockRepository.create.mockReturnValue(recharge);
      mockReservationRepository.findOne.mockReturnValue(reservation);

      await service
        .create({
          reservationId: reservation.id,
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(BadRequestException);
          expect(e).toMatchObject({
            message: 'The reservation is not valid!',
          });
        });
      expect(mockReservationRepository.findOne).toBeCalledTimes(1);
    });

    it('should reservation when doesnt find', async () => {
      const reservation = MockReservation.mockReservation();
      const recharge = MockRecharge.mockRecharge();
      mockStationRepository.findOne.mockReturnValue(recharge.station);
      mockUserRepository.findOne.mockReturnValue(recharge.user);
      mockRepository.findOne.mockReturnValue(null);
      mockRepository.save.mockReturnValue(recharge);
      mockRepository.create.mockReturnValue(recharge);
      mockReservationRepository.findOne.mockReturnValue(null);

      await service
        .create({
          reservationId: reservation.id,
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e).toMatchObject({
            message: 'Reservation not found',
          });
        });
      expect(mockReservationRepository.findOne).toBeCalledTimes(1);
    });
  });

  describe('When search Recharge By Id', () => {
    it('should find a existing planet', async () => {
      const recharge = MockRecharge.mockRecharge();
      mockRepository.findOne.mockReturnValue(recharge);
      const rechargeFound = await service.findById('1');
      expect(rechargeFound).toMatchObject({
        id: recharge.id,
        user: recharge.user,
        station: recharge.station,
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should return a exception when does not to find a planet', async () => {
      mockRepository.findOne.mockReturnValue(null);
      expect(service.findById('3')).rejects.toBeInstanceOf(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When search Station History', () => {
    it('should be list Station History', async () => {
      const recharge = MockRecharge.mockRecharge();
      mockRepository.find.mockReturnValue([recharge, recharge]);
      const stations = await service.stationHistory(recharge.station.id);
      expect(stations).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('When finished Recharge', () => {
    it('Should update a user', async () => {
      const recharge = MockRecharge.mockRecharge();
      const finished = new Date();
      mockRepository.findOne.mockReturnValue(recharge);
      mockRepository.update.mockReturnValue({
        ...recharge,
        finished,
      });
      mockRepository.create.mockReturnValue({
        ...recharge,
        finished,
      });

      const resultRecharge = await service.updateFinishedRecharge('1');

      expect(resultRecharge).toMatchObject({ ...recharge, finished });
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.update).toBeCalledTimes(1);
    });
  });
});
