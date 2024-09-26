import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';
import { Member } from 'src/shared/entities/member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Loan,
      Member
      // Cooperative
    ]),
  ],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}
