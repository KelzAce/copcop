import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @Column()
  method: string;  // CARD, BANK_TRANSFER, WALLET

  @ManyToOne(() => User, (user) => user.payments)
  user: User;

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
