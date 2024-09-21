import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Role } from './roles.enum';
import { Cooperative } from 'src/shared/entities/cooperative.entity';
import { IsOptional, IsString, Matches } from 'class-validator';


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
  @Matches(/\.(jpg|jpeg|png)$/, {
    message: 'Photo must be a valid image file (jpg, jpeg, or png).',
  })
  image: string;

  @Column('varchar', { default: Role.MEMBER })
  role: string;

  @Column('bool', { default: false })
  is_verified: boolean;

  @ManyToOne(() => User, (user) => user.invitedBy, { nullable: true })
  invitedBy: string;

  @Column({ type: 'varchar', length: 11 })
  @IsString()
  @Matches(/^\d{11}$/, {
    message: 'BVN must be exactly 11 digits long.',
  })
  bvn: string;

  @Column('bool', { default: false, nullable: true })
  invitationAcceptance: boolean;

  @Column('timestamp', {
    nullable: true,
    name: 'invitationSentAt',
  })
  invitationSentAt: Date;

  @ManyToOne(() => Cooperative, (cooperative) => cooperative.users)
  cooperative: Cooperative;

  @Column('timestamp', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  created_at!: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
