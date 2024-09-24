import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KycService } from './kyc.service';
import { KycController } from './kyc.controller';
import { Kyc } from './entities/kyc.entity';
import { CooperativeOwnerService } from './companyOwner/companyOwner.service';
import { ConfigService } from '@nestjs/config';
// import { WalletModule } from '../wallet/wallet.module';
import { CooperativeOwner } from './companyOwner/companyOwner.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Kyc,
      CooperativeOwner,
    ]),
  
  ],
  controllers: [KycController],
  providers: [
    KycService,
    CooperativeOwnerService,
    ConfigService,
  ],
})
export class KycModule {}
