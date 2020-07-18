import { Field, ObjectType } from '@nestjs/graphql';
import { UserType } from '../users/user.type';

@ObjectType('Session')
export class SessionType {
  @Field()
  accessToken: string;

  @Field()
  user: UserType;
}
