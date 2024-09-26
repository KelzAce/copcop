import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { Cooperative } from 'src/cooperative/entities/cooperative.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      // Access,
      Cooperative
    ]),
  ],
  providers: [UserService, ConfigService],
  exports: [TypeOrmModule, UserService],
})
export class UsersModule {}
