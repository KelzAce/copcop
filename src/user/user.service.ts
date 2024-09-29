// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Cooperative } from 'src/cooperative/entities/cooperative.entity';
import { Role } from './entities/roles.enum';
import { Regulator } from 'src/regulator/entities/regulator.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Cooperative) private cooperativeRepository: Repository<Cooperative>,
    @InjectRepository(Regulator) private regulatorRepository: Repository<Regulator>
  ) {}

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // async createAdmin(email: string, password: string): Promise<User> {
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   const admin = this.usersRepository.create({ email, password: hashedPassword, role: Role.ADMIN });
  //   return this.usersRepository.save(admin);
  // }

  async createCooperative(name: string, presidentEmail: string) {
    // Create a new cooperative
    const cooperative = this.cooperativeRepository.create({ name });
    const president = await this.findByEmail(presidentEmail);
    if (!president) {
      // Create president with default password
      const password = 'defaultPassword';
      const hashedPassword = await bcrypt.hash(password, 10);
      const newPresident = this.usersRepository.create({
        email: presidentEmail,
        password: hashedPassword,
        role: Role.PRESIDENT,
        isPasswordChanged: false,
      });
      cooperative.president = newPresident;
    } else {
      cooperative.president = president;
    }
    return this.cooperativeRepository.save(cooperative);
  }

  async createRegulator(name: string, email: string, role: string) {
    // Create a new cooperative
    const regulator = this.regulatorRepository.create({ name, email, role });
    
    if (!regulator) {
      // Create regulator with default password
      const password = 'defaultPassword';
      const hashedPassword = await bcrypt.hash(password, 10);
      const newRegulator = this.usersRepository.create({
        email: email,
        password: hashedPassword,
        role: Role.REGULATOR,
        isPasswordChanged: false,
      });
      return this.cooperativeRepository.save(newRegulator);
    } 
  }

  // async inviteMembers(cooperativeId: number, members: { email: string }[]) {
  //   const cooperative = await this.cooperativeRepository.findOne(cooperativeId, { relations: ['members'] });
  //   members.forEach(async (memberData) => {
  //     const password = 'defaultPassword';
  //     const hashedPassword = await bcrypt.hash(password, 10);
  //     const member = this.usersRepository.create({
  //       email: memberData.email,
  //       password: hashedPassword,
  //       role: UserRole.MEMBER,
  //       isPasswordChanged: false,
  //     });
  //     cooperative.members.push(member);
  //   });
  //   return this.cooperativeRepository.save(cooperative);
  // }

  // async changeDefaultPassword(userId: number, newPassword: string) {
  //   const user = await this.findOne(userId);
  //   const hashedPassword = await bcrypt.hash(newPassword, 10);
  //   user.password = hashedPassword;
  //   user.isPasswordChanged = true;
  //   return this.usersRepository.save(user);
  // }
}
