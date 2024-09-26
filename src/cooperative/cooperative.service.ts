import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contribution } from 'src/contributions/entities/contribution.entity';
import { Loan } from 'src/loans/entities/loan.entity';
import { Member } from 'src/shared/entities/member.entity';
import { Role } from 'src/user/entities/roles.enum';
import { Repository } from 'typeorm';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CooperativeService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(Contribution)
    private contributionRepository: Repository<Contribution>,
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
    // @InjectRepository(Share)
    // private shareRepository: Repository<Share>,
  ) {}

  // Admin invites a new member
  async inviteMember(email: string, name: string, adminId: number): Promise<string> {
    const admin = await this.memberRepository.findOne({ where: { id: adminId } });

    if (!admin || admin.role !== Role.PRESIDENT) {
      throw new Error('Only admins can invite new members');
    }

    const invitationToken = uuidv4();

    const newMember = this.memberRepository.create({
      email,
      name,
      totalContributions: 0,
      totalLoans: 0,
      totalShares: 0,
      isActive: false,
      invitationToken,
    });

    await this.memberRepository.save(newMember);
    return `http://your-cooperative-app.com/onboard/${invitationToken}`;
  }

  // Complete onboarding for new member
  async completeOnboarding(token: string): Promise<Member> {
    const member = await this.memberRepository.findOne({ where: { invitationToken: token } });

    if (!member) {
      throw new Error('Invalid invitation token');
    }

    member.isActive = true;
    member.invitationToken = null; // Clear the token after onboarding
    return this.memberRepository.save(member);
  }

  // Assign a role to a member
  async assignRole(id: number, role: Role): Promise<Member> {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) {
      throw new Error('Member not found');
    }

    member.role = role;
    return this.memberRepository.save(member);
  }

  // Add a contribution
  async addContribution(memberId: number, amount: number): Promise<Contribution> {
    const member = await this.memberRepository.findOne({ where: { id: memberId } });
    if (!member) {
      throw new Error('Member not found');
    }

    const contribution = this.contributionRepository.create({
      member,
      amount,
      date: new Date(),
    });

    member.totalContributions += amount;
    await this.memberRepository.save(member);
    return this.contributionRepository.save(contribution);
  }

  // Take a loan
  async takeLoan(memberId: number, amount: number, interestRate: number, dueDate: Date): Promise<Loan> {
    const member = await this.memberRepository.findOne({ where: { id: memberId } });
    if (!member) {
      throw new Error('Member not found');
    }

    const loan = this.loanRepository.create({
      member,
      amount,
      interestRate,
      dateIssued: new Date(),
      dueDate,
      balance: amount,
    });

    member.totalLoans += amount;
    await this.memberRepository.save(member);
    return this.loanRepository.save(loan);
  }

  // Buy shares
  // async buyShares(memberId: number, shareValue: number, quantity: number): Promise<Share> {
  //   const member = await this.memberRepository.findOne({ where: { id: memberId } });
  //   if (!member) {
  //     throw new Error('Member not found');
  //   }

  //   const totalValue = shareValue * quantity;

  //   const share = this.shareRepository.create({
  //     member,
  //     shareValue,
  //     quantity,
  //     datePurchased: new Date(),
  //   });

  //   member.totalShares += totalValue;
  //   await this.memberRepository.save(member);
  //   return this.shareRepository.save(share);
  // }

  // Get financial summary for a member
  async getFinancialDetails(id: number): Promise<{
    totalContributions: number;
    totalLoans: number;
    totalShares: number;
  }> {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) {
      throw new Error('Member not found');
    }

    return {
      totalContributions: member.totalContributions,
      totalLoans: member.totalLoans,
      totalShares: member.totalShares,
    };
  }
}
