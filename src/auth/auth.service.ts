import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service';
import * as bcrypt from 'bcryptjs';

import { UsersService } from 'src/user/user.service';
import { AdminLoginDto } from 'src/admin/dto/login-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(email: string, pass: string): Promise<any> {
    const admin = await this.adminService.findByEmail(email);
    if (admin && (await bcrypt.compare(pass, admin.password))) {
      const { password, ...result } = admin;
      return result;
    }
    return null;
  }

  async validateUser(email: string, pass: string): Promise<any>{
    const user = await this.userService.findByEmail(email);
    if(user &&(await bcrypt.compare(pass, user.password))) {
      const {password, ...result} = user
      return result
    }
    return null
  }

  async login(adminLoginDto: AdminLoginDto) {
    const admin = await this.validateAdmin(
      adminLoginDto.email,
      adminLoginDto.password,
    );
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: admin.email, sub: admin.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
