import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
// import { Wallet } from '../../wallet/entities/wallet.entity';
// import { AccountWalletType } from '../../utils/enums';
// import { Ledger } from './ledger.entity';

@Entity('virtual-accounts')
export class VirtualAccounts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToOne(() => Wallet, (wallet) => wallet.id)
  // wallet: Wallet;

  // @ManyToOne(() => Ledger, (ledger) => ledger.virtualAccounts)
  // @JoinColumn({ name: 'ledgerId' })
  // ledger: Ledger;

  @Column('varchar', { nullable: false, default: 'NGN' })
  currency: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'createdAt',
  })
  createdAt!: Date;

  @Column('varchar', { nullable: true })
  vAccount: string;

  @Column('varchar', { nullable: true })
  bankName: string;

  @Column({ nullable: true, type: 'boolean', default: false })
  active: boolean;

  @Column({ nullable: true, type: 'boolean', default: false })
  freeze: boolean;

  @Column('varchar', { nullable: true })
  poweredBy: string;

  @Column('varchar', { nullable: true })
  accountName: string;

  @Column('varchar', { nullable: true })
  payReference: string;

  // @Column({
  //   nullable: true,
  //   type: 'enum',
  //   enum: AccountWalletType,
  //   default: AccountWalletType.PERMANENT,
  // })
  // accountType: AccountWalletType;

  @Column({ name: 'expiryTime', nullable: true })
  expiryTime: Date;
}
