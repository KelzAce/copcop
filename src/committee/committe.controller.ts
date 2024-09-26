import { Controller, UseGuards, Get, Post, Body, Param, Req } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { ExcoGuard } from 'src/common/guards/exco.guard';
import { CommitteeService } from './committe.service';

@ApiTags('committee')
@Controller('committee')
@UseGuards(ExcoGuard)  // Only excos have access
export class CommitteeController {
  constructor(private readonly committeeService: CommitteeService) {}

  @Get('loans')
  getPendingLoanRequests() {
    return this.committeeService.getPendingLoans();
  }

  @Post('loans/:id/approve')
  approveLoanRequest(@Param('id') loanId: string, @Req() req) {
    return this.committeeService.approveLoan(req.loanId, req.user);
  }

  @Post('loans/:id/decline')
  declineLoanRequest(@Param('id') loanId: string, @Req() req) {
    return this.committeeService.declineLoan(req.loanId, req.user);
  }

  @Get('chat')
  getExcoChat() {
    return this.committeeService.getExcoChatMessages();
  }

  @Post('chat')
  sendMessage(@Body('message') message: string, @Req() req) {
    return this.committeeService.sendMessage(req.user, message);
  }
}
