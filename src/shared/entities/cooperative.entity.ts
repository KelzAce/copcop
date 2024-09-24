import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Access } from 'src/access/entities/access.entity';
import { IsOptional } from 'class-validator';

@Entity('cooperative')
export class Cooperative {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, unique: true })
  cooperative_name: string;


  @Column('varchar')
  @OneToOne(() => Access)
  @JoinColumn({ name: 'access', referencedColumnName: 'id' })
  access: Access;

  @Column('varchar', {default: false, nullable: true})
  @ManyToMany(() => User, (user) => user.cooperative)
  users: User[];

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
