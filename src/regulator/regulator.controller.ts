// src/regulator/regulator.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // JWT Guard for authentication
import { RegulatorService } from './regulator.service';
import { CreateRegulatorDto } from './dto/create-regulator.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('regulator')
@Controller('regulator')
export class RegulatorController {
  constructor(private readonly regulatorService: RegulatorService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createRegulator(@Body() createRegulatorDto: CreateRegulatorDto) {
    return this.regulatorService.createRegulator(createRegulatorDto);
  }
}
