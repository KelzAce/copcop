import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Loan } from "./entities/loan.entity";
import { Repository } from "typeorm";
import { CreateLoanDto } from "./dto/create-loan.dto";

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
  ) {}

  // async applyForLoan(userId: number, loanDto: CreateLoanDto) {
  //   const loan = this.loanRepository.create({ userId, ...loanDto });
  //   return this.loanRepository.save(loan);
  // }

  // async getLoansByUser(userId: number) {
  //   return this.loanRepository.find({ where: { userId } });
  // }
}
