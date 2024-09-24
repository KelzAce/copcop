import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiConfigService } from './shared/services/api-config.service';
// import configuration from './shared/config/configuration';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
// import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AccessControlModule } from 'nest-access-control';
// import { roles } from './app.roles';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './user/user.module';
import { AccessModule } from './access/access.module';
import { SharedModule } from './shared/services/shared.module';
import configuration from './shared/config/configuration';
import { KycModule } from './kyc/kyc.module';
import { LoansModule } from './loans/loans.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.TypeormConfig,
      inject: [ApiConfigService],
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    SharedModule,
    UsersModule,
    // ApikeyModule,
    // SenderIdModule,
    // WalletModule,
    // AccessControlModule.forRoles(roles),
    AuthModule,
    AccessModule,
    // ContactModule,
    // ResourceLockModule,
    // PaymentProviderModule,
   
   
    // CardPaymentModule,
    // WebhookModule,
    // NotificationModule,
    // GatewayModule,
   
    KycModule,
    LoansModule,
 
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
