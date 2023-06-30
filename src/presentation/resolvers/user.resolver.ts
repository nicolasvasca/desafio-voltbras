import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from '../../application/services/user.service';
import { CreateUserInput } from '../dtos/user/create-user.input';
import { User } from '../../domain/models/user.entity';
import { UpdateUserInput } from '../dtos/user/update-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../infra/security/guards/jwt-auth.guard';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [User])
  async users(): Promise<User[]> {
    const users = await this.userService.find();
    return users;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async user(@Args('id') id: string): Promise<User> {
    const user = await this.userService.findById(id);
    return user;
  }

  @Mutation(() => User)
  async register(@Args('input') input: CreateUserInput): Promise<User> {
    const user = await this.userService.createUser(input);
    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<User> {
    const user = this.userService.updateUser(id, input);
    return user;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    const deleted = await this.userService.deleteUser(id);
    return deleted;
  }
}
