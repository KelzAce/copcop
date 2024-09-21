import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { dbConfigs } from './types/dbConfig';

import { Access } from 'src/access/entities/access.entity';
import { Cooperative } from '../entities/cooperative.entity';
import { User } from 'src/user/entities/user.entity';

// import { Kyc } from '../../kyc/entities/kyc.entity';

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
        //Bring all Entities here
        Cooperative,
        Access,
        User,
        
        // Notification,
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
