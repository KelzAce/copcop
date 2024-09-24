import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BusinessCategory, KycStatus, KycType } from './enums';
import { CooperativeOwner } from '../companyOwner/companyOwner.entity';
import { Cooperative } from 'src/shared/entities/cooperative.entity';

@Entity('kyc')
export class Kyc {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false })
  bankName: string;

  @Column('varchar', { nullable: false })
  acctNo: string;

  @Column('varchar', { nullable: false })
  acctName: string;

  @Column('varchar')
  bvn: string;

  @Column('varchar')
  bvnSecondTrustee: string;

  @Column('varchar')
  businessName: string;

  @Column('varchar')
  tradingName: string;

  @Column('varchar')
  phone: string;

  @Column('varchar')
  email: string;

  @Column('varchar')
  supportEmail: string;

  @Column('varchar')
  supportPhone: string;

  @Column('varchar')
  category: string;

  @Column('varchar')
  description: string;

  @Column('varchar')
  estimatedMonthlySale: string;

  @Column('varchar')
  country: string;

  @Column('varchar')
  state: string;

  @Column('varchar')
  city: string;

  @Column('varchar')
  address: string;

  @Column('varchar')
  identityDocUrl: string;

  @Column('varchar')
  identityDocType: string;

  @Column('varchar')
  identityDocNumber: string;

  @Column('varchar')
  certIncorpTrusteeUrl: string;

  @Column('varchar')
  incorpTrusteeDocUrl: string;

  @Column('varchar')
  constitutionDocUrl: string;

  @Column('varchar')
  additionalDocUrl: string;

  @Column({
    type: 'enum',
    enumName: 'businessCategory',
    enum: BusinessCategory,
  })
  businessCategory: BusinessCategory;

  @Column('varchar')
  businessType: string;

  @Column('varchar')
  companyRegistrationNumber: string;

  @Column('varchar')
  certIncorpUrl: string;

  @Column('varchar')
  operatingLicenseUrl: string;

  @Column('varchar')
  memorandumUrl: string;

  @Column('varchar')
  photoUrl: string;

  @Column({
    type: 'enum',
    enumName: 'kycStatus',
    enum: KycStatus,
    default: KycStatus.PENDING,
  })
  status: KycStatus;

  @Column({
    type: 'enum',
    enumName: 'kycType',
    enum: KycType,
  })
  kycType: KycType;

  @Column('varchar', { default: 0 })
  progress: number;

  @Column('boolean', { default: false })
  isCompleted: boolean;

  @Column('timestamp', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'createdAt',
  })
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Cooperative, { nullable: true })
  @JoinColumn({ name: 'cooperativeId', referencedColumnName: 'id' })
  cooperative: Cooperative;

  @OneToMany(() => CooperativeOwner, (cooperativeOwner) => cooperativeOwner.kyc)
  cooperativeOwner: CooperativeOwner[];
}
