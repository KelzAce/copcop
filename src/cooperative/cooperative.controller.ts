// cooperative.controller.ts
import { Controller, Get, Param, Post, Body, Patch, HttpCode, HttpStatus } from '@nestjs/common';
import { CooperativeService } from './cooperative.service';

import { Loan } from 'src/loans/entities/loan.entity';
import { Contribution } from 'src/contributions/entities/contribution.entity';
import { Member } from 'src/shared/entities/member.entity';
import { Role } from 'nest-access-control';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { Cooperative } from './entities/cooperative.entity';

@Controller('cooperative')
export class CooperativeController {
  constructor(private readonly cooperativeService: CooperativeService) {}

  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: Cooperative, description: 'Invitation Successful' })
  @Post('invite')
  inviteMember(
    @Body('email') email: string,
    @Body('name') name: string,
    @Body('adminId') adminId: number,
  ): Promise<string> {
    return this.cooperativeService.inviteMember(email, name, adminId);
  }

  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: Cooperative, description: 'Onboarded' })
  @Get('onboard/:token')
  completeOnboarding(@Param('token') token: string): Promise<Member> {
    return this.cooperativeService.completeOnboarding(token);
  }

  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: Cooperative, description: 'Invitation Successful' })
  @Patch('assign-role/:id')
  assignRole(@Param('id') id: number, @Body('role') role: Role): Promise<Member> {
    return this.cooperativeService.assignRole(id, role);
  }

  @Post('contribution/:memberId')
  addContribution(
    @Param('memberId') memberId: number,
    @Body('amount') amount: number,
  ): Promise<Contribution> {
    return this.cooperativeService.addContribution(memberId, amount);
  }

  @Post('loan/:memberId')
  takeLoan(
    @Param('memberId') memberId: number,
    @Body('amount') amount: number,
    @Body('interestRate') interestRate: number,
    @Body('dueDate') dueDate: Date,
  ): Promise<Loan> {
    return this.cooperativeService.takeLoan(memberId, amount, interestRate, dueDate);
  }

  // @Post('shares/:memberId')
  // buyShares(
  //   @Param('memberId') memberId: number,
  //   @Body('shareValue') shareValue: number,
  //   @Body('quantity') quantity: number,
  // ): Promise<Share> {
  //   return this.cooperativeService.buyShares(memberId, shareValue, quantity);
  // }

  @Get('financial-details/:id')
  getFinancialDetails(@Param('id') id: number): Promise<{ totalContributions: number; totalLoans: number; totalShares: number; }> {
    return this.cooperativeService.getFinancialDetails(id);
  }
}
