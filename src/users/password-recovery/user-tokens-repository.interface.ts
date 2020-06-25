import { UserToken } from './user-token.entity';

export default interface IUserTokensRepository {
  generate(email: string): Promise<UserToken>;
  findByToken(token: string): Promise<UserToken | undefined>;
}
