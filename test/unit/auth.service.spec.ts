import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '../../src/application/services/auth.service';
import MockRepository from './__mocks__/mock-repository';
import { UserService } from '../../src/application/services/user.service';
import { User } from '../../src/domain/models/user.entity';
import { JwtModule } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let mockRepository = MockRepository.mockRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '1d',
          },
        }),
      ],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    mockRepository = MockRepository.resetMocks(mockRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
