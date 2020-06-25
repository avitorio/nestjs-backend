import { Repository, EntityRepository } from 'typeorm';
import { uuid } from 'uuidv4';
import { UserToken } from './user-token.entity';
import IUserTokensRepository from './user-tokens-repository.interface';

@EntityRepository(UserToken)
export class UserTokensRepository extends Repository<UserToken>
  implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(email: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      email,
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(
      findToken => findToken.token === token,
    );

    return userToken;
  }
}
