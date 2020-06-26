import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ValidationPipe } from '@nestjs/common';
import { AuthCredentialsInput } from '../auth/dto/auth-crendentials.input';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserType } from './user.type';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation(returns => UserType)
  signUp(
    @Args('authCredentialsInput', ValidationPipe)
    authCredentialsInput: AuthCredentialsInput,
  ): Promise<UserType> {
    return this.usersService.signUp(authCredentialsInput);
  }
}
