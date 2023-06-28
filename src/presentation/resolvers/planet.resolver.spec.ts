import { Test, TestingModule } from '@nestjs/testing';
import { PlanetResolver } from './planet.resolver';

describe('PlanetResolver', () => {
  let resolver: PlanetResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanetResolver],
    }).compile();

    resolver = module.get<PlanetResolver>(PlanetResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
