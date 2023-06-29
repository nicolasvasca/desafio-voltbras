import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from '../../src/application/services/seed.service';
import { HttpModule } from '@nestjs/axios';
import { PlanetService } from '../../src/application/services/planet.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Planet } from '../../src/domain/models/planet.entity';
import { NasaGateway } from '../../src/infra/gateway/NasaGateway';

describe('SeedService', () => {
  let service: SeedService;
  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        SeedService,
        NasaGateway,
        PlanetService,
        {
          provide: getRepositoryToken(Planet),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
