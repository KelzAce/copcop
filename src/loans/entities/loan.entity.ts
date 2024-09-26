import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Cooperative } from 'src/cooperative/entities/cooperative.entity';
import { Contribution } from 'src/contributions/entities/contribution.entity';
import { Member } from 'src/shared/entities/member.entity';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @Column()
  interestRate: number;

  @ManyToOne(() => User, (user) => user.loans)
  user: User;

  @ManyToOne(() => Cooperative, (cooperative) => cooperative.loans)
  @JoinColumn()
  cooperative: Cooperative;

  @OneToMany(() => Contribution, (contribution) => contribution.loan)
  contributions: Contribution[];

  @ManyToOne(() => Loan, loan => loan.member)  // Defines the inverse side of the relationship
  member: Member[]; 

  @Column()
  approvedBy: string;

  @Column('varchar', {  nullable: true })
  @IsOptional()
  status: string

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
