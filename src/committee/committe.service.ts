import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from 'src/loans/entities/loan.entity';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class CommitteeService {
  constructor(
    @InjectRepository(Loan) private loanRepository: Repository<Loan>,
    @InjectRepository(ChatMessage) private chatRepository: Repository<ChatMessage>,
  ) {}

  async getPendingLoans() {
    return this.loanRepository.find({ where: { status: 'pending' } });
  }

  async approveLoan(loanId: number, approvedBy: User) {
    const loan = await this.loanRepository.findOne(loanId);
    if (!loan) {
      throw new Error('Loan not found');
    }

    loan.status = 'approved';
    loan.approvedBy = approvedBy;
    return this.loanRepository.save(loan);
  }

  async declineLoan(loanId: number, declinedBy: User) {
    const loan = await this.loanRepository.findOne(loanId);
    if (!loan) {
      throw new Error('Loan not found');
    }

    loan.status = 'declined';
    loan.declinedBy = declinedBy;
    return this.loanRepository.save(loan);
  }

  async getExcoChatMessages() {
    return this.chatRepository.find({ relations: ['sender'] });
  }

  async sendMessage(sender: User, message: string) {
    const chatMessage = this.chatRepository.create({ sender, message });
    return this.chatRepository.save(chatMessage);
  }
}
