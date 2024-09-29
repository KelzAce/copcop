import { Cooperative } from 'src/cooperative/entities/cooperative.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './roles.enum';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column({ default: false })
  isPasswordChanged: boolean;  // To track if default password was changed

  @ManyToMany(() => Cooperative, (cooperative) => cooperative.members)
  @JoinTable()
  cooperatives: Cooperative[]; // User can belong to multiple cooperatives

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


