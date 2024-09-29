// src/regulator/regulator.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/user/user.service';
import { CreateRegulatorDto } from './dto/create-regulator.dto';
import { Role } from 'src/user/entities/roles.enum';

@Injectable()
export class RegulatorService {
  constructor(private readonly userService: UsersService) {}

  async createRegulator(body: CreateRegulatorDto) {
    const email = body.email;
    const role = Role.REGULATOR

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const regulator = await this.userService.createRegulator(email, hashedPassword, role);

    // Send email/SMS with credentials (email sending logic not implemented here)

    return regulator;
  }
}
