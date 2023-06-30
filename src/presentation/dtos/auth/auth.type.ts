import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../../domain/models/user.entity';

@ObjectType()
export class AuthType {
  @Field(() => User)
  user: User;

  token: string;
}
