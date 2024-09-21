import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Access } from './entities/access.entity';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { Cooperative } from '../shared/entities/cooperative.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Cooperative,
      Access,
    ]),
  ],
  controllers: [AccessController],
  providers: [AccessService, UserService],
  exports: [AccessService],
})
export class AccessModule {}
