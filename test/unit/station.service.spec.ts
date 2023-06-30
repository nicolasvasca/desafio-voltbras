import { Test, TestingModule } from '@nestjs/testing';
import { StationService } from '../../src/application/services/station.service';
import { Station } from '../../src/domain/models/station.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlanetService } from '../../src/application/services/planet.service';
import { Planet } from '../../src/domain/models/planet.entity';
import MockStation from './__mocks__/mock-station';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import MockRepository from './__mocks__/mock-repository';

describe('StationService', () => {
  let service: StationService;
  let mockRepository = MockRepository.mockRepository();
  let mockPlanetRepository = MockRepository.mockRepository();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StationService,
        PlanetService,
        {
          provide: getRepositoryToken(Station),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Planet),
          useValue: mockPlanetRepository,
        },
      ],
    }).compile();

    service = module.get<StationService>(StationService);
  });

  beforeEach(() => {
    mockRepository = MockRepository.resetMocks(mockRepository);
    mockPlanetRepository = MockRepository.resetMocks(mockPlanetRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When search All Station', () => {
    it('should be list all planets', async () => {
      const station = MockStation.mockStation();
      mockRepository.find.mockReturnValue([station, station]);
      const stations = await service.find();
      expect(stations).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('When search Station By Id', () => {
    it('should find a existing station', async () => {
      const station = MockStation.mockStation();
      mockRepository.findOne.mockReturnValue(station);
      const stationFound = await service.findById('1');
      expect(stationFound).toMatchObject({
        name: station.name,
        planet: station.planet,
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should return a exception when does not to find a planet', async () => {
      mockRepository.findOne.mockReturnValue(null);
      expect(service.findById('3')).rejects.toBeInstanceOf(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When create station', () => {
    it('should create a station', async () => {
      const station = MockStation.mockStation();
      mockPlanetRepository.findOne.mockReturnValue(station.planet);
      mockRepository.save.mockReturnValue(station);
      mockRepository.create.mockReturnValue(station);
      mockPlanetRepository.save.mockReturnValue({
        ...station.planet,
        hasStation: true,
      });

      const savedStation = await service.create({
        name: station.name,
        planetName: station.planet.name,
      });

      expect(savedStation).toMatchObject(station);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });

    it('should return a exception when doesnt create a station', async () => {
      const station = MockStation.mockStation();
      mockPlanetRepository.findOne.mockReturnValue(station.planet);
      mockRepository.save.mockReturnValue(null);
      mockRepository.create.mockReturnValue(station);

      await service
        .create({
          name: station.name,
          planetName: station.planet.name,
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(InternalServerErrorException);
          expect(e).toMatchObject({
            message: 'Problem to create a station. Try again',
          });
        });
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });

  it('should return a exception when doesnt find a planet', async () => {
    const station = MockStation.mockStation();
    mockPlanetRepository.findOne.mockReturnValue(null);

    await service
      .create({
        name: station.name,
        planetName: station.planet.name,
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e).toMatchObject({
          message: 'Planet not found',
        });
      });
    expect(mockPlanetRepository.findOne).toBeCalledTimes(1);
  });

  it('should return a exception when doesnt update a planet', async () => {
    const station = MockStation.mockStation();
    mockPlanetRepository.findOne.mockReturnValue(station.planet);
    mockRepository.save.mockReturnValue(station);
    mockRepository.create.mockReturnValue(station);
    mockPlanetRepository.update.mockReturnValue(null);
    mockPlanetRepository.create.mockReturnValue({
      ...station.planet,
      hasStation: true,
    });

    await service
      .create({
        name: station.name,
        planetName: station.planet.name,
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e).toMatchObject({
          message: 'Problem to update Planet. Try again',
        });
      });
    expect(mockRepository.create).toBeCalledTimes(1);
    expect(mockRepository.save).toBeCalledTimes(1);
  });
});
