import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './auth.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cooperative } from 'src/shared/entities/cooperative.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Cooperative)
    private cooperativeRepository: Repository<Cooperative>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateEmailVerificationLink(email: string): Promise<string> {
    const signedToken = this.jwtService.sign(
      { email },
      { expiresIn: '24h', secret: this.configService.get('HASH_TOKEN_SECRET')},
    );

    const verifyUrl = `${this.configService.get(
      'SERVER_APP_URL',
    )}/auth/verification/email?token=${signedToken}`;

    return verifyUrl;
  }

  async verifyEmailVerificationToken(token): Promise<IJwtPayload> {
    return this.jwtService.verify(token, {
      secret: this.configService.get('HASH_TOKEN_SECRET'),
    });
  }
  async generateHash(payload: any, expiresIn = '10m') {
    return this.jwtService.sign(payload, {
      expiresIn,
      secret: this.configService.get<string>('hashTokenSecret'),
    });
  }

  async findMerchant(name: string): Promise<Cooperative | null> {
    try {
      const merchants = await this.cooperativeRepository.findOne({
        where: { cooperative_name: name },
      });
      return merchants;
    } catch {}
  }

  async verifyHash(hash: string) {
    return this.jwtService.verify(hash, {
      secret: this.configService.get<string>('hashTokenSecret'),
      ignoreExpiration: true,
    });
  }

  async verifyAccessToken(hash: string) {
    return this.jwtService.verify(hash, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      ignoreExpiration: true,
    });
  }

  async verifyUser(user: any) {
    const { id, full_name, email, role, merchant } = user;

    const data = {
      id: id,
      full_name: full_name,
      email: email,
      role: role,
      merchant_name: merchant,
    };

    return data;
  }
}
