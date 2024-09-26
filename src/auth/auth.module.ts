import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

// import { SendChampService } from 'src/shared/services/sendchamp.service';
import { Cooperative } from 'src/cooperative/entities/cooperative.entity';
import { AuthController } from './auth.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Cooperative, /*Apikey*/]),
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
    UserService,
    JwtStrategy,
    JwtService,
    ConfigService,
    // SendChampService
  ],
  exports: [TypeOrmModule, AuthService],
})
export class AuthModule {}
