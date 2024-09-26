import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { Loan } from 'src/loans/entities/loan.entity';
import { Contribution } from 'src/contributions/entities/contribution.entity';
import { IsOptional } from 'class-validator';
import { Role } from 'src/user/entities/roles.enum';

@Entity('member')
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Role, default: Role.MEMBER })
  role: Role;

  @Column({ default: 0 })
  totalContributions: number; // Total contributions made by the member

  @Column({ default: 0 })
  totalLoans: number; // Total loans taken by the member

  @Column({ default: 0 })
  totalShares: number; // Total shares owned by the member

  @OneToMany(() => Contribution, (contribution) => contribution.member)
  @IsOptional()
  @JoinColumn({ name: 'contributionId' })
  contributions: Contribution[];

  @OneToMany(() => Loan, (loan) => loan.member)
  @JoinColumn({ name: 'loanId' })
  loans: Loan[];

//   @OneToMany(() => Share, (share) => share.member)
//   shares: Share[];

@Column('bool', { default: false, nullable: true })
@IsOptional()
isActive: boolean

@Column('bool', { default: false, nullable: true })
@IsOptional()
invitationToken: string;

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
