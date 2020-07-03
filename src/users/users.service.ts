import { Injectable, Logger, Inject } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import IHashProvider from '../shared/providers/hash/models/hash-provider.interface';

@Injectable()
export class UsersService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @Inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async signUp(createUserInput: CreateUserInput): Promise<boolean> {
    const { email, password } = createUserInput;

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
