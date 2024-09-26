import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
// import { SystemWalletType, WalletStatus } from '../../utils/enums';

@Entity('system-wallet')
export class SystemWalletEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', name: 'balance', nullable: true, default: 0 })
  balance?: number;

  // @Column({
  //   type: 'simple-enum',
  //   name: 'type',
    // enum: SystemWalletType,
    // default: SystemWalletType.SystemWallet,
  // })
  // type: SystemWalletType;

  // @Column({ type: 'simple-enum', name: 'status', enum: WalletStatus })
  // status: WalletStatus;

  @Column('varchar', { nullable: false, unique: true })
  ref: string;

  @Column('varchar', { nullable: true, default: 'bani' })
  provider: string;

  @Column('varchar', { nullable: true, default: 'rexpay' })
  cardProvider: string;

  @Column('varchar', { nullable: true, default: 'wema' })
  activePaymentBank: string;

  async putMoney(amount: number): Promise<SystemWalletEntity> {
    this.balance = Number(this.balance) + Number(amount);
    return this;
  }

  async removeMoney(amount: number): Promise<SystemWalletEntity> {
    this.balance = Number(this.balance) - Number(amount);
    return this;
  }
}
