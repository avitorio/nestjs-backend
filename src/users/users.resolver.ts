import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ValidationPipe } from '@nestjs/common';
import { AuthCredentialsInput } from '../auth/dto/auth-crendentials.input';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation(returns => Boolean)
  signUp(
    @Args('authCredentialsInput', ValidationPipe)
    authCredentialsInput: AuthCredentialsInput,
  ): Promise<boolean> {
    return this.usersService.signUp(authCredentialsInput);
  }
}
