import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';


@Entity()
export class Cooperative {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.role)
  president: User;  // The president of the cooperative

  @ManyToMany(() => User)
  members: User[];  // Cooperative members

  @ManyToMany(() => User)
  excos: User[];  // Cooperative executives (Secretary, Financial Secretary)
}
