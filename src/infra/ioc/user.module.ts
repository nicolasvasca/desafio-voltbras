import { Module } from '@nestjs/common';
import { UserService } from '../../application/services/user.service';
import { UserResolver } from '../../presentation/resolvers/user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/models/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserResolver],
})
export class UserModule {}
