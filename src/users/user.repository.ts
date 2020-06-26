import { Repository, EntityRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { AuthCredentialsInput } from '../auth/dto/auth-crendentials.input';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
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
