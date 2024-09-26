import { Module } from '@nestjs/common';
import { ContributionsService } from './contributions.service';
import { ContributionsController } from './contributions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contribution } from './entities/contribution.entity';
import { Member } from 'src/shared/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contribution, Member])],
  controllers: [ContributionsController],
  providers: [ContributionsService],
  exports: [ContributionsService]
})
export class ContributionsModule {}
