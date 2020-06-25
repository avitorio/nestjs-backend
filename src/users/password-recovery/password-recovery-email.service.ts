import { Logger, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user.repository';
import { MailProvider } from '../../shared/providers/mail/provider/mail.provider';
import { UserTokensRepository } from './user-tokens.repository';

interface IRequest {
  email: string;
}

@Injectable()
export class PasswordRecoveryEmailService {
  private logger = new Logger('PasswordRecoveryEmail');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @Inject(MailProvider)
    private mailProvider: MailProvider,

    @InjectRepository(UserTokensRepository)
    private userTokensRepository: UserTokensRepository,
  ) {}

  async execute({ email }: IRequest): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('User does not exist');
    }

    this.userTokensRepository.generate(user.id);

    await this.mailProvider.sendMail(email, 'Password recovery email sent');
  }
}
