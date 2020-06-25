import { Test } from '@nestjs/testing';
import { UserRepository } from '../user.repository';
import { PasswordRecoveryEmailService } from './password-recovery-email.service';
import { MailProvider } from '../../shared/providers/mail/provider/mail.provider';
import { UserTokensRepository } from './user-tokens.repository';

const mockUser = { email: 'johndoe@example.com', password: '123123' };

const mockUserRepository = () => ({
  signUp: jest.fn(),
  create: jest.fn(),
  findByEmail: jest.fn(),
});

let userRepository: UserRepository;
let passwordRecoveryEmailService: PasswordRecoveryEmailService;
let userTokensRepository: UserTokensRepository;

describe('PasswordRecoveryEmail', () => {
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PasswordRecoveryEmailService,
        { provide: UserRepository, useFactory: mockUserRepository },
        MailProvider,
        UserTokensRepository,
      ],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);

    passwordRecoveryEmailService = await module.get<
      PasswordRecoveryEmailService
    >(PasswordRecoveryEmailService);

    userTokensRepository = await module.get<UserTokensRepository>(
      UserTokensRepository,
    );
  });

  it('should be able to recover the password by email', async () => {
    userRepository.findByEmail = jest
      .fn()
      .mockResolvedValue({ email: 'johndoe@example.com' });

    await userRepository.signUp(mockUser);

    jest.spyOn(passwordRecoveryEmailService, 'execute');

    await passwordRecoveryEmailService.execute({
      email: 'johndoe@example.com',
    });

    expect(passwordRecoveryEmailService.execute).toHaveBeenCalledWith({
      email: 'johndoe@example.com',
    });
  });

  it('should not send password recovery email to non-existent users', async () => {
    await expect(async () => {
      await passwordRecoveryEmailService.execute({
        email: 'jonasdoe@example.com',
      });
    }).rejects.toEqual(new Error('User does not exist'));
  });

  it('should generate a forgot password token', async () => {
    userRepository.findByEmail = jest
      .fn()
      .mockResolvedValue({ email: 'johndoe@example.com' });

    await userRepository.signUp(mockUser);

    jest.spyOn(passwordRecoveryEmailService, 'execute');
    jest.spyOn(userTokensRepository, 'generate');

    await passwordRecoveryEmailService.execute({
      email: 'johndoe@example.com',
    });

    expect(userTokensRepository.generate).toHaveBeenCalled();
  });
});
