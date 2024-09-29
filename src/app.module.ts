import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './user/user.module';
import { CooperativeModule } from './cooperative/cooperative.module';
import { ApiConfigService } from './shared/services/api-config.service';
import configuration from './shared/config/configuration';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { RegulatorModule } from './regulator/regulator.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [],
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
    UsersModule,
    AuthModule,
    CooperativeModule,
    SharedModule,
    AdminModule,
    RegulatorModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
