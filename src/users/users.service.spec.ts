import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { BCryptHashProvider } from './providers/hash-provider/implementations/bcrypt-hash.provider';
import { UsersService } from './users.service';

const mockCredentialsDto = {
  email: 'test@email.com',
  password: 'TestPassword',
};

describe('UserRepository', () => {
  let userRepository;
  let usersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UsersService, UserRepository, BCryptHashProvider],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
    usersService = await module.get<UsersService>(UsersService);
  });

  describe('signUp', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('successfully signs up the user', () => {
      save.mockResolvedValue(undefined);

      expect(usersService.signUp(mockCredentialsDto)).resolves.not.toThrow();
    });

    it('throws a conflict exception as email already exists', async () => {
      save.mockRejectedValue({ code: '23505' });
      await expect(usersService.signUp(mockCredentialsDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('throws a conflict exception as email alreadt exists', async () => {
      save.mockRejectedValue({ code: '123123' });
      await expect(usersService.signUp(mockCredentialsDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
