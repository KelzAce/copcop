import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from 'src/loans/entities/loan.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { CommitteeController } from './committe.controller';
import { CommitteeService } from './committe.service';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, ChatMessage])],
  controllers: [CommitteeController],
  providers: [CommitteeService],
})
export class CommitteeModule {}
