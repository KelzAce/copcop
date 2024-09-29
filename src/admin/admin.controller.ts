import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CreateAdminDto } from 'src/auth/dto/admin.dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @UseGuards(JwtAuthGuard)
  @Post('create')
  async createAdmin(@Body() body: CreateAdminDto) {
    const email = body.email 
    const password = body.password
    return await this.adminService.createAdmin(email, password);
  }
}
