import { Cooperative } from '../../shared/entities/cooperative.entity';
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

  @Column({
    type: 'json',
    nullable: false,
  })
  principalRole: Record<string, any>;

  @Column({
    type: 'json',
    nullable: false,
  })
  adminstratorRole: Record<string, any>;
  @Column({
    type: 'json',
    nullable: false,
  })
  supervisorRole: Record<string, any>;
  @Column({
    type: 'json',
    nullable: false,
  })
  othersRole: Record<string, any>;
}
