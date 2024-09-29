import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { Cooperative } from 'src/cooperative/entities/cooperative.entity';
import { Regulator } from 'src/regulator/entities/regulator.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Cooperative,
      Regulator
    ]),
  ],
  providers: [UsersService, ConfigService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
