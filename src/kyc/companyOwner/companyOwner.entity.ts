import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Kyc } from '../entities/kyc.entity';
import { Cooperative } from '../../shared/entities/cooperative.entity';

@Entity('companyOwner')
export class CooperativeOwner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('boolean', { nullable: false })
  isBusinessOwner: boolean;

  @Column('boolean', { nullable: false })
  ownsMoreThan5PercentageOfCompany: boolean;

  @Column('varchar', { nullable: false })
  fullName: string;

  @Column('varchar', { nullable: false })
  email: string;

  @Column('varchar', { nullable: false })
  phone: string;

  @Column('varchar', { nullable: false })
  state: string;

  @Column('varchar', { nullable: false })
  city: string;

  @Column('varchar', { nullable: false })
  address: string;

  @Column('varchar', { nullable: false })
  bvn: string;

  @Column('varchar', { nullable: false })
  docType: string;

  @Column('varchar', { nullable: false })
  docUrl: string;

  @Column('varchar', { nullable: false })
  docNumber: string;

  @Column('timestamp', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'createdAt',
  })
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Kyc, (kyc) => kyc.cooperativeOwner)
  kyc: Kyc;

  @ManyToOne(() => Cooperative, (cooperative) => cooperative)
  cooperative: Cooperative;
}
