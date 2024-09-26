import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './auth.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import axios from 'axios';
import { User } from 'src/user/entities/user.entity';
import { Cooperative } from 'src/cooperative/entities/cooperative.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private lastOTPSentAt: Map<string, Date> = new Map();  // Track last OTP sent time

  constructor(
    @InjectRepository(Cooperative)
    private cooperativeRepository: Repository<Cooperative>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async verifyUser(user: User) {
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user; // You might want to return only certain user details
  }

  async generateHash(payload: any, expiresIn = '10m'): Promise<string> {
    return this.jwtService.sign(payload, {
      expiresIn,
      secret: process.env.HASH_TOKEN_SECRET, // Ensure this is set in your environment variables
    });
  }

  async verifyHash(hash: string): Promise<IJwtPayload> {
    try {
      return this.jwtService.verify<IJwtPayload>(hash, {
        secret: process.env.HASH_TOKEN_SECRET, // Ensure this is set in your environment variables
        ignoreExpiration: false, // You can set to true if you want to ignore expiration
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired hash');
    }
  }

  async verifyEmailVerificationToken(token: string): Promise<IJwtPayload> {
    try {
      const payload = this.jwtService.verify<IJwtPayload>(token, {
        secret: process.env.EMAIL_VERIFICATION_SECRET,
      });
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
  
  async generateEmailVerificationCode(email: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Optionally send the OTP to the user's email
    await this.sendOTPToEmail(email, otp);
    
    this.lastOTPSentAt.set(email, new Date());  // Store last sent time
    return otp;  // Return the generated OTP
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    // Here you might want to check the OTP against your database or store
    // For demonstration purposes, let's assume you store it temporarily
    // This should match the OTP sent to the user. 
    // Implement your own logic for OTP validation
    const isValid = true;  // Replace with your validation logic

    if (isValid) {
      this.logger.log(`OTP verified for email: ${email}`);
      return true;
    }
    this.logger.error(`Invalid OTP for email: ${email}`);
    return false;
  }

  async resendOTP(email: string): Promise<string> {
    // Check if 1 minute has passed since the last OTP was sent
    const oneMinute = 60 * 1000;  // 1 minute in milliseconds
    const lastSentTime = this.lastOTPSentAt.get(email);

    if (lastSentTime && (new Date().getTime() - lastSentTime.getTime()) < oneMinute) {
      const timeRemaining = Math.ceil((oneMinute - (new Date().getTime() - lastSentTime.getTime())) / 1000);
      throw new Error(`You need to wait ${timeRemaining} more seconds to resend OTP.`);
    }

    return this.generateEmailVerificationCode(email);  // Resend the OTP
  }

  private async sendOTPToEmail(email: string, otp: string): Promise<void> {
    const options = {
      method: 'POST',
      url: `${this.configService.get('BASE_URL')}/otp/send`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Api-Token': this.configService.get('SENDCHAMP_TOKEN'),
      },
      data: {
        channel: "email",
        token_type: "numeric",
        sender: "Sendchamp",
        token_length: "6",
        expiration_time: 6,  // OTP expires in 6 minutes
        email: email,
        meta_data: {
          otp: otp // Optionally include OTP in metadata for tracking
        }
      }
    };

    try {
      await axios(options);
      this.logger.log(`OTP sent to email: ${email}`);
    } catch (error) {
      this.logger.error('Error sending OTP:', error.message);
      throw new Error(error.message);
    }
  }
}
