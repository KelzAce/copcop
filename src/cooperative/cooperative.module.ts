import { Module } from '@nestjs/common';
import { CooperativeService } from './cooperative.service';
import { CooperativeController } from './cooperative.controller';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cooperative } from './entities/cooperative.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Cooperative
    ]),
  ],
  controllers: [CooperativeController],
  providers: [CooperativeService],
  exports: [CooperativeService]
})
export class CooperativeModule {}
