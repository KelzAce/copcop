import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DbTransactionFactory } from './services/TransactionManager/TransactionManager';
import { TransactionRunner } from './services/TransactionManager/TransactionManager.service';
import { Member } from './entities/member.entity';
import { Contribution } from 'src/contributions/entities/contribution.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  providers: [
    ApiConfigService,
    ConfigService,
    DbTransactionFactory,
    TransactionRunner,
    Contribution
  ],
  exports: [
    ApiConfigService,
    ConfigService,
    DbTransactionFactory,
    TransactionRunner,
    Contribution
  ],
})
export class SharedModule {}
