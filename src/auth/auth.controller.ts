import { Controller, Post, Body, Req, UseGuards, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CreateAdminDto } from './dto/admin.dto';
import { loginUserDto } from './dto/login-user.dto';
import { CooperativeService } from 'src/cooperative/cooperative.service';
import { CreateCooperativeDto } from 'src/cooperative/dto/create-cooperative.dto';
import { inviteUserDto } from './dto/inviteUser.dto';
import { User } from 'src/user/entities/user.entity';
import { AdminService } from 'src/admin/admin.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cooperativeService: CooperativeService,
    private readonly adminService: AdminService
  ) {}

  @Post('login')
  async login(@Body() body: loginUserDto) {

    const email = body.email 
    const password = body.password

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @Post('register-admin')
  async registerAdmin(@Body() body: CreateAdminDto) {
    const email = body.email 
    const password = body.password

    const admin = this.adminService.createAdmin(email, password);
  }

  @Post('create-cooperative')
  @UseGuards(JwtAuthGuard)
  async createCooperative(@Body() createCooperativeDto: CreateCooperativeDto) {
    return this.cooperativeService.createCooperative(createCooperativeDto)
  }

  // @Post('invite-members')
  // @UseGuards(JwtAuthGuard)
  // async inviteMembers(@Body() body: inviteUserDto) {
  //   const link = this.authService.inviteMembers(body);
  //   return link
  // }

  // @Post('change-password')
  // @UseGuards(JwtAuthGuard)
  // async changePassword(@Body('newPassword') newPassword: string, @Req() req: any) {
  //   return this.authService.changePassword(req.user.userId, newPassword);
  // }
}
