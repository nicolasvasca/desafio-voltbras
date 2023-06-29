import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/application/services/user.service';
import { User } from '../../src/domain/models/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import MockUser from './__mocks__/mock-user';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import MockRepository from './__mocks__/mock-repository';

describe('UserService', () => {
  let service: UserService;
  let mockRepository = MockRepository.mockRepository();
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    mockRepository = MockRepository.resetMocks(mockRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When search All Users', () => {
    it('should be list all users', async () => {
      const user = MockUser.mockUser();
      mockRepository.find.mockReturnValue([user, user]);
      const users = await service.find();
      expect(users).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('When search User By Id', () => {
    it('should find a existing user', async () => {
      const user = MockUser.mockUser();
      mockRepository.findOne.mockReturnValue(user);
      const userFound = await service.findById('1');
      expect(userFound).toMatchObject({ name: user.name });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should return a exception when does not to find a user', async () => {
      mockRepository.findOne.mockReturnValue(null);
      expect(service.findById('3')).rejects.toBeInstanceOf(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When create user', () => {
    it('should create a user', async () => {
      const user = MockUser.mockUser();
      mockRepository.save.mockReturnValue(user);
      mockRepository.create.mockReturnValue(user);
      const savedUser = await service.createUser(user);

      expect(savedUser).toMatchObject(user);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
    it('should return a exception when doesnt create a user', async () => {
      const user = MockUser.mockUser();
      mockRepository.save.mockReturnValue(null);
      mockRepository.create.mockReturnValue(user);

      await service.createUser(user).catch((e) => {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e).toMatchObject({
          message: 'Problem to create a user. Try again',
        });
      });
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });

  describe('When update User', () => {
    it('Should update a user', async () => {
      const user = MockUser.mockUser();
      const updatedUser = { name: 'New Name' };
      mockRepository.findOne.mockReturnValue(user);
      mockRepository.update.mockReturnValue({
        ...user,
        ...updatedUser,
      });
      mockRepository.create.mockReturnValue({
        ...user,
        ...updatedUser,
      });

      const resultUser = await service.updateUser('1', {
        ...user,
        name: 'New Name',
      });

      expect(resultUser).toMatchObject(updatedUser);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.update).toBeCalledTimes(1);
    });
  });

  describe('When delete User', () => {
    it('Should delete a existing user', async () => {
      const user = MockUser.mockUser();
      mockRepository.delete.mockReturnValue(user);
      mockRepository.findOne.mockReturnValue(user);

      const deletedUser = await service.deleteUser('1');

      expect(deletedUser).toBe(true);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledTimes(1);
    });

    it('Should not delete a inexisting user', async () => {
      const user = MockUser.mockUser();
      mockRepository.delete.mockReturnValue(null);
      mockRepository.findOne.mockReturnValue(user);

      const deletedUser = await service.deleteUser('9');

      expect(deletedUser).toBe(false);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledTimes(1);
    });
  });
});
