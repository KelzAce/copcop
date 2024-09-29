import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { User } from 'src/user/entities/user.entity';
import { Cooperative } from 'src/cooperative/entities/cooperative.entity';
import { Regulator } from 'src/regulator/entities/regulator.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Admin, Cooperative, Regulator])
  ],
  controllers: [AdminController],
  providers: [AdminService, UsersService],
})
export class AdminModule {}
