// src/regulator/regulator.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/user/user.service';
import { Role } from 'src/user/entities/roles.enum';
import { CreateAdminDto } from 'src/auth/dto/admin.dto';
import { Admin } from './entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
  ) {}

  async findByEmail(email: string): Promise<Admin> {
    return this.adminRepository.findOne({ where: { email } });
  }

  async createAdmin(email: string, password: string): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await this.adminRepository.create({ email, password: hashedPassword});
    return this.adminRepository.save(admin);
  }
}
