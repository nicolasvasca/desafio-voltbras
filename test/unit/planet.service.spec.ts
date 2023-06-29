import { Test, TestingModule } from '@nestjs/testing';
import { PlanetService } from '../../src/application/services/planet.service';
import { Planet } from '../../src/domain/models/planet.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
