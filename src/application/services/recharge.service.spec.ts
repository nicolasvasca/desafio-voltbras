import { Test, TestingModule } from '@nestjs/testing';
import { RechargeService } from './recharge.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Recharge } from '../../domain/models/recharge.entity';
import { StationService } from './station.service';
import { UserService } from './user.service';
import { User } from '../../domain/models/user.entity';
import { Station } from '../../domain/models/station.entity';
import { Planet } from '../../domain/models/planet.entity';
import { PlanetService } from './planet.service';

describe('RechargeService', () => {
  let service: RechargeService;
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
      providers: [
        RechargeService,
        UserService,
        StationService,
        PlanetService,
        {
          provide: getRepositoryToken(Recharge),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Station),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Planet),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RechargeService>(RechargeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
