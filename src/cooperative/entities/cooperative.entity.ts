import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Contribution } from 'src/contributions/entities/contribution.entity';
import { Loan } from 'src/loans/entities/loan.entity';


@Entity()
export class Cooperative {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.cooperative)
  members: User[];

  @OneToMany(() => Loan, (loan) => loan.cooperative)
  loans: Loan[];

  @OneToMany(() => Contribution, (contribution) => contribution.cooperative)
  contributions: Contribution[];

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
