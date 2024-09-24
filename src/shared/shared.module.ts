import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DbTransactionFactory } from './services/TransactionManager/TransactionManager';
import { TransactionRunner } from './services/TransactionManager/TransactionManager.service';
import { DojahService} from './services/dojah.service';


@Global()
@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [
    ApiConfigService,
    ConfigService,
    DbTransactionFactory,
    TransactionRunner,
    DojahService
  ],
  exports: [
    ApiConfigService,
    ConfigService,
    DbTransactionFactory,
    TransactionRunner,

  ],
})
export class SharedModule {}
