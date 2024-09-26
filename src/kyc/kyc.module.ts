import { Module } from '@nestjs/common';

import { KycController } from './kyc.controller';
import { KYCService } from './kyc.service';
import { KYC } from './entities/kyc.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KYC
    ]),
  ],
  controllers: [KycController],
  providers: [KYCService],
})
export class KycModule {}
