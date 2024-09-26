import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, OneToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { IsOptional } from 'class-validator';
import { Payment } from 'src/payments/entities/payment.entity';
import { Role } from './roles.enum';
import { Cooperative } from 'src/cooperative/entities/cooperative.entity';
import { Loan } from 'src/loans/entities/loan.entity';
import { Contribution } from 'src/contributions/entities/contribution.entity';
import { KYC } from 'src/kyc/entities/kyc.entity';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false })
  first_name: string;

  @Column('varchar', { nullable: false })
  last_name: string;

  @Column('varchar', { nullable: false, unique: true })
  email: string;

  @Column('varchar', { nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.MEMBER,
  })
  role: Role;

  @ManyToOne(() => Cooperative, (cooperative) => cooperative.members)
  cooperative: Cooperative;

  @OneToMany(() => Loan, (loan) => loan.user)
  loans: Loan[];

  @OneToMany(() => Contribution, (contribution) => contribution.user)
  contributions: Contribution[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToOne(() => KYC, (kyc) => kyc.user)
  @JoinColumn()
  kyc: KYC;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date;

  @Column({name: 'last_login', nullable: true })
  last_login: Date

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

