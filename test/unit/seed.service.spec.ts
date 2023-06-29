import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from '../../src/application/services/seed.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { PlanetService } from '../../src/application/services/planet.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Planet } from '../../src/domain/models/planet.entity';
import { NasaGateway } from '../../src/infra/gateway/NasaGateway';
import MockRepository from './__mocks__/mock-repository';
import MockSeed from './__mocks__/mock-seed';
import MockPlanet from './__mocks__/mock-planet';

describe('SeedService', () => {
  let service: SeedService;
  const mockRepository = MockRepository.mockRepository();
  const mockNasaGateway = MockSeed.mockNasaGateway();
  const mockHttpService = MockSeed.mockHttpService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        SeedService,
        PlanetService,
        {
          provide: NasaGateway,
          useValue: mockNasaGateway,
        },
        {
          provide: getRepositoryToken(Planet),
          useValue: mockRepository,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When Seed Run', () => {
    it('should create a planets', async () => {
      const planet = MockPlanet.mockPlanet();
      mockRepository.find.mockReturnValue([]);
      mockRepository.save.mockReturnValue(planet);
      mockRepository.create.mockReturnValue(planet);
      const seedFinish = await service.run();

      expect(seedFinish).toBe(true);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
    it('should create a planets', async () => {
      const planet = MockPlanet.mockPlanet();
      mockRepository.find.mockReturnValue([planet]);
      const seedFinish = await service.run();

      expect(seedFinish).toBe(true);
    });
  });
});
