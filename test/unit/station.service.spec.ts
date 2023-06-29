import { Test, TestingModule } from '@nestjs/testing';
import { StationService } from '../../src/application/services/station.service';
import { Station } from '../../src/domain/models/station.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlanetService } from '../../src/application/services/planet.service';
import { Planet } from '../../src/domain/models/planet.entity';

describe('StationService', () => {
  let service: StationService;
  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
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
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<StationService>(StationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
