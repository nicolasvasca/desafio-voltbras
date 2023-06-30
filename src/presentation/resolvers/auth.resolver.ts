import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from '../../application/services/auth.service';
import { AuthInput } from '../dtos/auth/auth.input';
import { AuthType } from '../dtos/auth/auth.type';

@Resolver('Auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthType)
  public async login(@Args('input') input: AuthInput): Promise<AuthType> {
    const response = await this.authService.validateUser(input);

    return {
      user: response.user,
      token: response.token,
    };
  }
}
