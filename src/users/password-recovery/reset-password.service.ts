import { Logger, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user.repository';
import { UserTokensRepository } from './user-tokens.repository';
import IHashProvider from '../../shared/providers/hash/models/hash-provider.interface';

interface IRequest {
  token: string;
  password: string;
}

@Injectable()
export class ResetPasswordService {
  private logger = new Logger('PasswordRecoveryEmail');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(UserTokensRepository)
    private userTokensRepository: UserTokensRepository,

    @Inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new Error('User token does not exist');
    }

    const user = await this.userRepository.findByEmail(userToken?.email);

    if (!user) {
      throw new Error('User does not exist');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.userRepository.save(user);
  }
}
