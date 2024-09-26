import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Cooperative } from 'src/cooperative/entities/cooperative.entity';
import { Loan } from 'src/loans/entities/loan.entity';
import { Member } from 'src/shared/services/entities/member.entity';

@Entity()
export class Contribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @ManyToOne(() => User, (user) => user.contributions)
  user: User;

  @ManyToOne(() => Cooperative, (cooperative) => cooperative.contributions)
  cooperative: Cooperative;

  @ManyToOne(() => Member, (member) => member.contributions)
  member: Member[];


  @ManyToOne(() => Loan, (loan) => loan.contributions, { nullable: true })
  loan: Loan;  // Optional: if the contribution is for loan repayment

  @Column('bool', { default: false, nullable: true })
  @IsOptional()
  status: boolean

  @Column('timestamp', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  created_at: Date;

  @Column('timestamp', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updated_at: Date;
}
