import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from '../../src/application/services/reservation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Recharge } from '../../src/domain/models/recharge.entity';
import MockRepository from './__mocks__/mock-repository';
import { RechargeService } from '../../src/application/services/recharge.service';
import { UserService } from '../../src/application/services/user.service';
import { StationService } from '../../src/application/services/station.service';
import { PlanetService } from '../../src/application/services/planet.service';
import { Station } from '../../src/domain/models/station.entity';
import { User } from '../../src/domain/models/user.entity';
import { Planet } from '../../src/domain/models/planet.entity';
import { Reservation } from '../../src/domain/models/reservation.entity';
import MockReservation from './__mocks__/mock-reservation';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import MockRecharge from './__mocks__/mock-recharge';

describe('ReservationService', () => {
  let service: ReservationService;
  let mockRepository = MockRepository.mockRepository();
  let mockStationRepository = MockRepository.mockRepository();
  let mockUserRepository = MockRepository.mockRepository();
  let mockPlanetRepository = MockRepository.mockRepository();
  let mockRechargeRepository = MockRepository.mockRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        RechargeService,
        UserService,
        StationService,
        PlanetService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Recharge),
          useValue: mockRechargeRepository,
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
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
  });

  beforeEach(() => {
    mockRepository = MockRepository.resetMocks(mockRepository);
    mockStationRepository = MockRepository.resetMocks(mockStationRepository);
    mockUserRepository = MockRepository.resetMocks(mockUserRepository);
    mockPlanetRepository = MockRepository.resetMocks(mockPlanetRepository);
    mockRechargeRepository = MockRepository.resetMocks(mockRechargeRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When search All Reservations', () => {
    it('should be list all reservations', async () => {
      const reservation = MockReservation.mockReservation();
      mockRepository.find.mockReturnValue([reservation, reservation]);
      const reservations = await service.find();
      expect(reservations).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('When search Resevation By Id', () => {
    it('should find a existing planet', async () => {
      const reservation = MockReservation.mockReservation();
      mockRepository.findOne.mockReturnValue(reservation);
      const reservationFound = await service.findById('1');
      expect(reservationFound).toMatchObject({
        id: reservation.id,
        user: reservation.user,
        station: reservation.station,
        recharge: reservation.recharge,
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should return a exception when does not to find a planet', async () => {
      mockRepository.findOne.mockReturnValue(null);
      expect(service.findById('3')).rejects.toBeInstanceOf(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When create reservation', () => {
    it('should create a reservation', async () => {
      const reservation = MockReservation.mockReservation();
      mockStationRepository.findOne.mockReturnValue(reservation.station);
      mockUserRepository.findOne.mockReturnValue(reservation.user);
      mockRepository.findOne.mockReturnValue(null);
      mockRepository.save.mockReturnValue(reservation);
      mockRepository.create.mockReturnValue(reservation);

      const savedReservation = await service.create({
        stationId: reservation.station.id,
        userId: reservation.user.id,
        start: reservation.started,
      });

      expect(savedReservation).toMatchObject(reservation);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });

    it('should return a exception when doesnt create a reservation', async () => {
      const reservation = MockReservation.mockReservation();
      mockStationRepository.findOne.mockReturnValue(reservation.station);
      mockUserRepository.findOne.mockReturnValue(reservation.user);
      mockRepository.findOne.mockReturnValue(null);
      mockRepository.save.mockReturnValue(null);
      mockRepository.create.mockReturnValue(reservation);

      await service
        .create({
          stationId: reservation.station.id,
          userId: reservation.user.id,
          start: reservation.started,
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
      const reservation = MockReservation.mockReservation();
      mockStationRepository.findOne.mockReturnValue(null);
      mockUserRepository.findOne.mockReturnValue(reservation.user);
      mockRepository.findOne.mockReturnValue(null);
      mockRepository.save.mockReturnValue(reservation);
      mockRepository.create.mockReturnValue(reservation);

      await service
        .create({
          stationId: reservation.station.id,
          userId: reservation.user.id,
          start: reservation.started,
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
      const reservation = MockReservation.mockReservation();
      mockStationRepository.findOne.mockReturnValue(reservation.station);
      mockUserRepository.findOne.mockReturnValue(null);
      mockRepository.findOne.mockReturnValue(null);
      mockRepository.save.mockReturnValue(reservation);
      mockRepository.create.mockReturnValue(reservation);

      await service
        .create({
          stationId: reservation.station.id,
          userId: reservation.user.id,
          start: reservation.started,
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e).toMatchObject({
            message: 'User not found',
          });
        });
      expect(mockUserRepository.findOne).toBeCalledTimes(1);
    });

    it('should return a exception when have a reservation', async () => {
      const reservation = MockReservation.mockReservation();
      mockStationRepository.findOne.mockReturnValue(reservation.station);
      mockUserRepository.findOne.mockReturnValue(reservation.user);
      mockRepository.findOne.mockReturnValue(reservation);
      mockRepository.save.mockReturnValue(reservation);
      mockRepository.create.mockReturnValue(reservation);

      await service
        .create({
          stationId: reservation.station.id,
          userId: reservation.user.id,
          start: reservation.started,
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(BadRequestException);
        });
      expect(mockUserRepository.findOne).toBeCalledTimes(1);
    });

    it('should return a exception when the date is not valid', async () => {
      const reservation = MockReservation.mockReservation();
      mockStationRepository.findOne.mockReturnValue(reservation.station);
      mockUserRepository.findOne.mockReturnValue(reservation.user);
      mockRepository.findOne.mockReturnValue(reservation);
      mockRepository.save.mockReturnValue(reservation);
      mockRepository.create.mockReturnValue(reservation);

      await service
        .create({
          stationId: reservation.station.id,
          userId: reservation.user.id,
          start: new Date(),
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(BadRequestException);
          expect(e).toMatchObject({
            message: 'This date is not valid',
          });
        });
      expect(mockUserRepository.findOne).toBeCalledTimes(1);
    });
  });

  describe('When update recharge Reservation', () => {
    it('Should update recharge', async () => {
      const reservation = MockReservation.mockReservation();
      const recharge = MockRecharge.mockRecharge();
      mockRechargeRepository.findOne.mockReturnValue(recharge);
      mockRepository.findOne.mockReturnValue(reservation);
      mockRepository.update.mockReturnValue({
        ...reservation,
        recharge,
      });
      mockRepository.create.mockReturnValue({
        ...reservation,
        recharge,
      });

      const resultPlanet = await service.updateRecharge('1', recharge.id);

      expect(resultPlanet).toMatchObject({ recharge });
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.update).toBeCalledTimes(1);
    });
  });
});
