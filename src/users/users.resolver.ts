import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation(returns => Boolean)
  signUp(
    @Args('createUserInput', ValidationPipe)
    createUserInput: CreateUserInput,
  ): Promise<boolean> {
    return this.usersService.signUp(createUserInput);
  }
}
