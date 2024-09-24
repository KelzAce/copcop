import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { Role } from './roles.enum';
import { Cooperative } from 'src/shared/entities/cooperative.entity';
import { IsOptional, IsString, Matches } from 'class-validator';
import { Access } from 'src/access/entities/access.entity';


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

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @IsString()
  phone_number: string

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @IsString()
  gender: string

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/\.(jpg|jpeg|png)$/, {
    message: 'Photo must be a valid image file (jpg, jpeg, or png).',
  })
  image: string;

  @Column({type: 'varchar', nullable:true})
  @IsOptional()
  @IsString()
  bank_account_id: string;

  @Column('varchar', { default: Role.MEMBER, nullable: true })
  @IsOptional()
  role: string;

  @Column('bool', { default: false, nullable:true })
  @IsOptional()
  is_verified: boolean;

  @Column({type: 'varchar', nullable:true})
  @IsOptional()
  @ManyToOne(() => User, (user) => user.invitedBy, { nullable: true })
  invitedBy: string;

  @Column({ type: 'varchar', length: 11 })
  @IsString()
  @IsOptional()
  @Matches(/^\d{11}$/, {
    message: 'BVN must be exactly 11 digits long.',
  })
  bvn: string;

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
  invitationSentAt: Date;

  @Column('varchar', { default: false, nullable: true })
  @OneToOne(() => Access, (access) => access.users)
  access: Access

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
