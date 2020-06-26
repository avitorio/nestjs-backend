import { Injectable, Logger, Inject } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialsInput } from '../auth/dto/auth-crendentials.input';
import { User } from './user.entity';
import { BCryptHashProvider } from './providers/hash-provider/implementations/bcrypt-hash.provider';
import IHashProvider from './providers/hash-provider/models/hash-provider.interface';

@Injectable()
export class UsersService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @Inject(BCryptHashProvider)
    private hashProvider: IHashProvider,
  ) {}

  async signUp(authCredentialsInput: AuthCredentialsInput): Promise<boolean> {
    const { email, password } = authCredentialsInput;

    const user = await this.userRepository.create();

    user.email = email;
    user.password = await this.hashProvider.generateHash(password);

    try {
      await user.save();
      return true;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
