import { Test, TestingModule } from '@nestjs/testing';
import { PlanetService } from '../../src/application/services/planet.service';
import { Planet } from '../../src/domain/models/planet.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import MockPlanet from './__mocks__/mock-planet';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('PlanetService', () => {
  let service: PlanetService;
  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanetService,
        {
          provide: getRepositoryToken(Planet),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PlanetService>(PlanetService);
  });

  beforeEach(() => {
    mockRepository.find.mockReset();
    mockRepository.findOne.mockReset();
    mockRepository.create.mockReset();
    mockRepository.save.mockReset();
    mockRepository.update.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When search All Planets', () => {
    it('should be list all planets', async () => {
      const planet = MockPlanet.mockPlanet();
      mockRepository.find.mockReturnValue([planet, planet]);
      const planets = await service.find();
      expect(planets).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('When search Planets by name', () => {
    it('should be find a existing planet', async () => {
      const planet = MockPlanet.mockPlanet();
      mockRepository.findOne.mockReturnValue(planet);
      const planetFound = await service.findByName(planet.name);
      expect(planetFound).toMatchObject({ name: planet.name });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should return a exception when does not to find a planet', async () => {
      mockRepository.findOne.mockReturnValue(null);
      expect(service.findByName('any')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When search Planet By Id', () => {
    it('should find a existing planet', async () => {
      const planet = MockPlanet.mockPlanet();
      mockRepository.findOne.mockReturnValue(planet);
      const planetFound = await service.findById('1');
      expect(planetFound).toMatchObject({ name: planet.name });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should return a exception when does not to find a planet', async () => {
      mockRepository.findOne.mockReturnValue(null);
      expect(service.findById('3')).rejects.toBeInstanceOf(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When create planet', () => {
    it('should create a planet', async () => {
      const planet = MockPlanet.mockPlanet();
      mockRepository.save.mockReturnValue(planet);
      mockRepository.create.mockReturnValue(planet);
      const savedPlanet = await service.create(planet);

      expect(savedPlanet).toMatchObject(planet);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
    it('should return a exception when doesnt create a planet', async () => {
      const planet = MockPlanet.mockPlanet();
      mockRepository.save.mockReturnValue(null);
      mockRepository.create.mockReturnValue(planet);

      await service.create(planet).catch((e) => {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e).toMatchObject({
          message: 'Problem to create a planet. Try again',
        });
      });
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });

  describe('When update hasStation Planet', () => {
    it('Should update a hasStation', async () => {
      const planet = MockPlanet.mockPlanet();
      mockRepository.findOne.mockReturnValue(planet);
      mockRepository.update.mockReturnValue({
        ...planet,
        hasStation: true,
      });
      mockRepository.create.mockReturnValue({
        ...planet,
        hasStation: true,
      });

      const resultPlanet = await service.updateHasStation('1');

      expect(resultPlanet).toMatchObject({ hasStation: true });
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.update).toBeCalledTimes(1);
    });
  });
});
