import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { HttpModule } from '@nestjs/axios';
import { PlanetService } from './planet.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Planet } from '../../domain/models/planet.entity';
import { NasaGateway } from '../../infra/gateway/NasaGateway';

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
