import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CooperativeService } from './cooperative.service';
import { CooperativeController } from './cooperative.controller';
import { Loan } from 'src/loans/entities/loan.entity';
import { Contribution } from 'src/contributions/entities/contribution.entity';
import { Member } from 'src/shared/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, Contribution, Member])],
  providers: [CooperativeService],
  controllers: [CooperativeController],
})
export class CooperativeModule {}
