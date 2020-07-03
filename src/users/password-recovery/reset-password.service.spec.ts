import { Test } from '@nestjs/testing';
import { UserRepository } from '../user.repository';
import { ResetPasswordService } from './reset-password.service';
import { MailProvider } from '../../shared/providers/mail/provider/mail.provider';
import { UserTokensRepository } from './user-tokens.repository';
import { uuid } from 'uuidv4';
import { BCryptHashProvider } from '../../shared/providers/hash/provider/bcrypt-hash.provider';

const mockUserRepository = () => ({
  signUp: jest.fn((id, email, password) => {
    return { id, email, password };
  }),
  create: jest.fn(),
  findByEmail: jest.fn(),
});

let userRepository: UserRepository;
let resetPasswordService: ResetPasswordService;
let userTokensRepository: UserTokensRepository;

describe('PasswordRecoveryEmail', () => {
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResetPasswordService,
        { provide: UserRepository, useFactory: mockUserRepository },
        MailProvider,
        UserTokensRepository,
        { provide: 'HashProvider', useClass: BCryptHashProvider }
      ],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);

    resetPasswordService = await module.get<ResetPasswordService>(
      ResetPasswordService,
    );

    userTokensRepository = await module.get<UserTokensRepository>(
      UserTokensRepository,
    );
  });

  it('should be able to reset the password', async () => {
    userRepository.findByEmail = jest.fn().mockResolvedValue({
      id: uuid(),
      email: 'johndoe@example.com',
      password: '123123',
    });

    userRepository.save = jest.fn();

    jest.spyOn(userTokensRepository, 'generate');

    const { token } = await userTokensRepository.generate(
      'johndoe@example.com',
    );

    await resetPasswordService.execute({
      password: '123456',
      token,
    });

    userRepository.findByEmail = jest.fn().mockResolvedValue({
      id: uuid(),
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await userRepository.findByEmail('johndoe@example.com');

    expect(updatedUser?.password).toBe('123456');
  });
});
