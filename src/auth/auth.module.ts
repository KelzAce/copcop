import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { Cooperative } from 'src/shared/entities/cooperative.entity';
// import { ApikeyService } from '../apikey/apikey.service';
// import { Apikey } from '../apikey/entities/apikey.entity';

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
    // ApikeyService,
  ],
  exports: [TypeOrmModule, AuthService],
})
export class AuthModule {}
