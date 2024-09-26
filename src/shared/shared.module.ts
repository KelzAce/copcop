import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DbTransactionFactory } from './services/TransactionManager/TransactionManager';
import { TransactionRunner } from './services/TransactionManager/TransactionManager.service';
import { Member } from './services/entities/member.entity';


@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  providers: [
    ApiConfigService,
    ConfigService,
    DbTransactionFactory,
    TransactionRunner,
  ],
  exports: [
    ApiConfigService,
    ConfigService,
    DbTransactionFactory,
    TransactionRunner,
  ],
})
export class SharedModule {}
