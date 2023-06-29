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

describe('RechargeService', () => {
  let service: RechargeService;
  const mockRepository = MockRepository.mockRepository();
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
