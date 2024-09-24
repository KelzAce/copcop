import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    DeleteDateColumn,
    ManyToMany,
    OneToOne,
  } from 'typeorm';
  import { Cooperative } from 'src/shared/entities/cooperative.entity';
  import { IsOptional, IsString, Matches } from 'class-validator';
  import { Access } from 'src/access/entities/access.entity';
import { LoanType } from './loans_type.enum';
  
  
  @Entity('loans')
  export class Loan {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('varchar', { nullable: false })
    loan_name: string;
  
    @Column('varchar', { default: LoanType.Contributory, nullable: false })
    loan_type: string;
  
    @Column('bool', { default: false, nullable:true })
    @IsOptional()
    is_verified: boolean;
  
  
    @Column('bool', { default: false, nullable: true })
    @IsOptional()
    invitationAcceptance: boolean;
  
    @Column('varchar', { default: false, nullable: true })
    @ManyToMany(() => Cooperative, (cooperative) => cooperative.users)
    cooperative: Cooperative;
  
    @Column('timestamp', {
      nullable: true,
      name: 'invitationSentAt',
    })
    LoanApplyAt: Date;
  
    @Column('varchar', { default: false, nullable: true })
    @OneToOne(() => Access, (access) => access.users)
    access: Access
  
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
  