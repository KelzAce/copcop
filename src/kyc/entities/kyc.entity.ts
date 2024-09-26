import { IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';


@Entity()
export class KYC {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bvn: string;

  @Column()
  bankAccount: string;

  @Column()
  photoUrl: string;

  @OneToOne(() => User, (user) => user.kyc)
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
