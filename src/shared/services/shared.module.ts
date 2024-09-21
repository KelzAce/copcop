import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from '../services/api-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DbTransactionFactory } from '../services/TransactionManager/TransactionManager';
import { TransactionRunner } from '../services/TransactionManager/TransactionManager.service';
// import { MailjetService } from './services/mailjet.service';
// import { TwilioApiService } from './services/twilio.api.service';
// import { SendBirdService } from './services/sendBird.service';
// import { PaymentService } from './services/payment.service';
// import { WhatsappNotificationService } from './services/WhatappNotification.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [
    ApiConfigService,
    ConfigService,
    DbTransactionFactory,
    TransactionRunner,
    // MailjetService,
    // TwilioApiService,
    // SendBirdService,
    // PaymentService,
    // WhatsappNotificationService,
  ],
  exports: [
    ApiConfigService,
    ConfigService,
    DbTransactionFactory,
    TransactionRunner,
    // MailjetService,
    // TwilioApiService,
    // SendBirdService,
    // PaymentService,
    // WhatsappNotificationService,
  ],
})
export class SharedModule {}
