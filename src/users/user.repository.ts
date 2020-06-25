import { Repository, EntityRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { AuthCredentialsInput } from '../auth/dto/auth-crendentials.input';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsInput: AuthCredentialsInput): Promise<boolean> {
    const { email, password } = authCredentialsInput;

    const user = this.create();

    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

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

  async validateUserPassword(
    authCredentialsInput: AuthCredentialsInput,
  ): Promise<string> {
    const { email, password } = authCredentialsInput;

    const user = await this.findOne({ email });

    if (user && (await user.validatePassword(password))) {
      return user.email;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.findOne({ email });

    if (!user) {
      return null;
    }

    return user;
  }
}
