import { Module } from '@nestjs/common';
import { RegulatorService } from './regulator.service';
import { RegulatorController } from './regulator.controller';
import { UsersService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Regulator } from './entities/regulator.entity';
import { User } from 'src/user/entities/user.entity';
import { Cooperative } from 'src/cooperative/entities/cooperative.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Regulator, User, Cooperative])],
  controllers: [RegulatorController],
  providers: [RegulatorService, UsersService],
})
export class RegulatorModule {}
