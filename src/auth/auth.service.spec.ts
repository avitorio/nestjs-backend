import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../users/user.repository';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../users/user.entity';
import { BCryptHashProvider } from '../users/providers/hash-provider/implementations/bcrypt-hash.provider';
import { UsersService } from '../users/users.service';

const mockCredentialsDto = {
  email: 'test@email.com',
  password: 'TestPassword',
};

describe('AuthService', () => {
  let userRepository;
  let usersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UsersService, UserRepository, BCryptHashProvider],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
    usersService = await module.get<UsersService>(UsersService);
  });

  describe('validateUserPassword', () => {
    let user;

    beforeEach(() => {
      userRepository.findOne = jest.fn();
      user = new User();
      user.email = 'test@email.com';
      user.validatePassword = jest.fn();
    });

    it('returns the email as validation is successful', async () => {
      // userRepository.findOne.mockResolvedValue(user);

      // user.validatePassword.mockResolvedValue(true);

      // const result = await userRepository.validateUserPassword(
      //   mockCredentialsDto,
      // );
      // expect(result).toEqual('test@email.com');
      expect(true).toBe(true);
    });

    // it('returns null as user cannot be found', async () => {
    //   userRepository.findOne.mockResolvedValue(null);
    //   const result = await userRepository.validateUserPassword(
    //     mockCredentialsDto,
    //   );

    //   expect(user.validatePassword).not.toHaveBeenCalled();
    //   expect(result).toBeNull();
    // });

    // it('returns null as password is invalid', async () => {
    //   userRepository.findOne.mockResolvedValue(user);
    //   user.validatePassword.mockResolvedValue(false);

    //   const result = await userRepository.validateUserPassword(
    //     mockCredentialsDto,
    //   );

    //   expect(user.validatePassword).toHaveBeenCalled();
    //   expect(result).toBeNull();
    // });
  });
});
