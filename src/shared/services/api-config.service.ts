import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { dbConfigs } from '../types/dbConfigs';
import { User } from '../../user/entities/user.entity';
import { KYC } from 'src/kyc/entities/kyc.entity';
import { VirtualAccounts } from '../entities/virtual-accounts.entity';
import { SystemWalletEntity } from '../entities/system-wallet.entity';
import { Cooperative } from 'src/cooperative/entities/cooperative.entity';
import { Contribution } from 'src/contributions/entities/contribution.entity';
import { Loan } from 'src/loans/entities/loan.entity';
import { Payment } from 'src/payments/entities/payment.entity';


@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}
  get TypeormConfig(): TypeOrmModuleOptions {
    const dbParams = this.configService.get<dbConfigs>('database');

    const { username, password, database, host, port }: dbConfigs = dbParams;

    return {
      type: 'postgres',
      migrations: [],
      entities: [
        Cooperative,
        Contribution,
        User,
        Loan,
        Payment,
        SystemWalletEntity,
        VirtualAccounts,
        KYC
      ],
      migrationsRun: true,
      username,
      password,
      database,
      host,
      port,
    };
  }
}
