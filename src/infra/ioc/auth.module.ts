import { Module } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { AuthResolver } from '../../presentation/resolvers/auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/models/user.entity';
import { UserService } from 'src/application/services/user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../security/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: 'desafio@voltbras',
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  providers: [AuthService, AuthResolver, UserService, JwtStrategy],
})
export class AuthModule {}
