import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UsersService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { Cooperative } from 'src/cooperative/entities/cooperative.entity';
import { AuthController } from './auth.controller';
import { CooperativeService } from 'src/cooperative/cooperative.service';
import { PassportModule } from '@nestjs/passport';
import { AdminService } from 'src/admin/admin.service';
import { Regulator } from 'src/regulator/entities/regulator.entity';
import { Admin } from 'src/admin/entities/admin.entity';


@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, Cooperative, Regulator, Admin]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '2h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    AdminService,
    JwtStrategy,
    JwtService,
    ConfigService,
    CooperativeService
  ],
  exports: [TypeOrmModule, AuthService, ],
})
export class AuthModule {}
