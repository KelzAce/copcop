import { Cooperative } from 'src/shared/entities/cooperative.entity';
import { User } from 'src/user/entities/user.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('access')
export class Access {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Cooperative)
  @JoinColumn({ name: 'cooperativeId', referencedColumnName: 'id' })
  cooperative: Cooperative;

  @Column('varchar', { default: false, nullable: true })
  @OneToOne(() => User, (user) => user.access)
  users: User

  @Column({
    type: 'json',
    nullable: false,
  })
  isExcoRole: Record<string, any>;
  @Column({
    type: 'json',
    nullable: false,
  })
  othersRole: Record<string, any>;
}
