import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ACGuard } from 'nest-access-control';
import { KycService } from './kyc.service';
import {
  BankDetailsDto,
  VerifyBankDetailsDto,
  VerifyBvnDto,
} from './dto/bankInfo';
import { Kyc } from './entities/kyc.entity';
import { BusinessInfoDto } from './dto/businessInfo';
import { GetBusinessInfoUpdateData } from './helpers/businessInfohelper';
import { User } from '../user/entities/user.entity';
import { AddtionalInfoDto } from './dto/addtionalInfo';
import { GetAdditionalInfoUpdateData } from './helpers/addtionalnfohelper';
import { UploadDocumentDto } from './dto/uploadDocument';
import { GetUploadDocumentUpdateData } from './helpers/uploadDocumenthelper';
import { CreateCompanyOwnerDto } from './dto/authBusinessRep';
import { CooperativeOwnerService } from './companyOwner/companyOwner.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { DbTransactionFactory } from '../shared/services/TransactionManager/TransactionManager';
import { AuthUser } from '../shared/decorators/auth-user.decorator';
import { ResponseDto } from '../shared/services/types/response';

@Controller('kyc')
@ApiTags('kyc')
@UseGuards(JwtAuthGuard, /*ACGuard*/)
@ApiBearerAuth('JWT')
export class KycController {
  private readonly logger = new Logger(KycController.name);

  constructor(
    private readonly kycService: KycService,
    private readonly cooperativeOwnerService: CooperativeOwnerService,
    private readonly events: EventEmitter2,
    private readonly configService: ConfigService,
    private readonly transactionRunner: DbTransactionFactory,
  ) {}

  @Get('/GetBanks')
  @HttpCode(HttpStatus.OK)
  async getBanks() {
    return this.kycService.getBankCodes();
  }

  @Get('/GetCooperativeKyc')
  @HttpCode(HttpStatus.OK)
  async getCooperativeKyc(@AuthUser() user: User): Promise<ResponseDto> {
    try {
      const res = await this.kycService.getCooperativeKyc(user.cooperative.id);
      if (res) {
        return { message: 'Kyc retrieved successfully', data: res };
      }
      return { message: 'No kyc found', data: res };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('/GetKycCompanyOwners/:kycId')
  @HttpCode(HttpStatus.OK)
  async getKycCompanyOwners(
    @AuthUser() user: User,
    @Param('kycId') kycId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    try {
      const res = await this.cooperativeOwnerService.getKycCompanyOwners({
        kycId,
        cooperativeId: user.cooperative.id,
        limit,
        page,
      });
      return { message: 'Company Owners retrieved successfully', data: res };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/verify-bank-details')
  @HttpCode(HttpStatus.OK)
  async verifyBankDetails(@Body() body: VerifyBankDetailsDto) {
    try {
      const res = await this.kycService.verifyAccountDetails(body);
      if (res.status) {
        return {
          message: 'Bank Details verified successfully',
          data: res,
        };
      }
      throw new BadRequestException('Bank details verification failed');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/verify-bvn')
  @HttpCode(HttpStatus.OK)
  async verifyBvn(@Body() body: VerifyBvnDto) {
    try {
      const res = await this.kycService.bvnVerification(body);
      if (res.status) {
        return { message: 'Bvn verified successfully', data: res };
      }
      throw new BadRequestException('Bvn verification failed');
    } catch (error) {
      throw new BadRequestException('Unable to verify your bvn at the moment');
    }
  }

  @Post('/SendPhoneVerifyOtp')
  @HttpCode(HttpStatus.OK)
  // async sendPaymentAuthCode(@Body() body: SendPhoneVerifyOtpDto) {
  //   const templateId = this.configService.get<string>('otpSmsTemplateId');
  //   const senderName = this.configService.get<string>('otpSmsSenderName');

  //   this.events.emit('forward-auth-code', {
  //     phone: body.phone,
  //     type: AUTH_CODE_TYPES.KYC,
  //     senderName: senderName,
  //     templateId: templateId,
  //   });

  //   return { message: 'Otp has been sent to your number' };
  // }

  // @Post('/VerifyPhoneNo')
  // @HttpCode(HttpStatus.OK)
  // async verifyPaymentAuthCode(@Body() body: VerifyPaymentAuthCodeDto) {
  //   const result = await this.authCodeService.verifyCode(
  //     body.code,
  //     AUTH_CODE_TYPES.KYC,
  //   );

  //   if (!result.success) {
  //     throw new BadRequestException(result?.error);
  //   }
  //   return { message: 'Phone number verified Successfully' };
  // }

  @Post('/bank-details')
  @HttpCode(HttpStatus.CREATED)
  async addBankDetails(@Body() body: BankDetailsDto, @AuthUser() user: User) {
    try {
      const kyc = await this.kycService.getCooperativeKyc(user.cooperative.id);
      if (kyc) {
        return { data: kyc };
      }
      const data: Partial<Kyc> = {
        ...body,
        progress: 1,
        cooperative: user.cooperative,
      };

      const res = await this.kycService.create(data);
      if (res) {
        return { message: 'Bank Details added successfully', data: res };
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('/business-info')
  @HttpCode(HttpStatus.OK)
  async addBusinessInfo(@Body() body: BusinessInfoDto, @AuthUser() user: User) {
    try {
      const kyc = await this.kycService.getCooperativeKyc(user.cooperative.id);

      const { data, /*mediaData*/ } = GetBusinessInfoUpdateData(body, kyc.kycType);

      // if (Object.keys(mediaData).length > 0) {
      //   await this.socialMediaService.create(mediaData, kyc, kyc.merchant);
      // }
      // const res = await this.kycService.update({ id: kyc.id }, data);
      // if (res) {
      //   return { message: 'Kyc updated successfully' };
      // }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('/additional-info')
  @HttpCode(HttpStatus.OK)
  async addAddtionalInfo(
    @Body() body: AddtionalInfoDto,
    @AuthUser() user: User,
  ) {
    let transactionRunner = null;
    try {
      transactionRunner = await this.transactionRunner.createTransaction();
      await transactionRunner.startTransaction();
      const transactionManager = transactionRunner.transactionManager;

      // const kyc = await this.kycService.getMerchantKyc(user.cooperative.id);
      // const socialMedia = await this.socialMediaService.getKycSocialMedia(
      //   kyc.id,
      //   user.cooperative.id,
      // );

    //   const { data, mediaData } = GetAdditionalInfoUpdateData(
    //     body,
    //     kyc.kycType,
    //   );
    //   if (Object.keys(mediaData).length > 0) {
    //     if (!socialMedia) {
    //       await this.socialMediaService.createWithTransaction(
    //         mediaData,
    //         kyc,
    //         kyc.cooperative,
    //         transactionManager,
    //       );
    //     } else {
    //       this.socialMediaService.update(
    //         { id: socialMedia.id },
    //         mediaData,
    //         transactionManager,
    //       );
    //     }
    //   }
    //   const res = await this.kycService.update(
    //     { id: kyc.id },
    //     data,
    //     transactionManager,
    //   );
    //   if (res) {
    //     if (data.isCompleted) {
    //       const account = await this.walletService.getUserWallet(
    //         user.cooperative.id,
    //       );
    //       if (account.account) {
    //         await transactionRunner.commitTransaction();
    //         return { message: 'Kyc completed successfully' };
    //       }
    //       const updatedKyc = await this.kycService.getMerchantKyc(
    //         user.cooperative.id,
    //       );
    //       const createdAccount =
    //         await this.walletService.createVirtualAccountByKyc(
    //           updatedKyc,
    //           user,
    //           transactionManager,
    //         );
    //       await transactionRunner.commitTransaction();
    //       return {
    //         message: 'Kyc completed successfully',
    //         data: createdAccount,
    //       };
    //     }
    //     await transactionRunner.commitTransaction();
    //     return { message: 'Kyc updated successfully' };
    //   }
    // } catch (error) {
    //   this.logger.error(error);
    //   if (transactionRunner) await transactionRunner.rollbackTransaction();
    //   throw new BadRequestException(error.message);
    } finally {
      if (transactionRunner) await transactionRunner.releaseTransaction();
    }
  }

  @Patch('/upload-documents')
  @HttpCode(HttpStatus.OK)
  async uploadDocuments(
    @Body() body: UploadDocumentDto,
    @AuthUser() user: User,
  ) {
    let transactionRunner = null;
    try {
      transactionRunner = await this.transactionRunner.createTransaction();
      await transactionRunner.startTransaction();
      const transactionManager = transactionRunner.transactionManager;

      const kyc = await this.kycService.getCooperativeKyc(user.cooperative.id);

      const data = GetUploadDocumentUpdateData(body, kyc.kycType);

      const res = await this.kycService.update(
        { id: kyc.id },
        data,
        transactionManager,
      );
      // if (res) {
      //   if (data.isCompleted) {
      //     const account = await this.walletService.getUserWallet(
      //       user.cooperative.id,
      //     );
      //     if (account.account) {
      //       await transactionRunner.commitTransaction();
      //       return { message: 'Kyc completed successfully' };
      //     }
      //     const updatedKyc = await this.kycService.getMerchantKyc(
      //       user.cooperative.id,
      //     );
          // const createdAccount =
          //   await this.walletService.createVirtualAccountByKyc(
          //     updatedKyc,
          //     user,
          //     transactionManager,
          //   );
          // await transactionRunner.commitTransaction();
          // return {
          //   message: 'Kyc completed successfully',
          //   data: createdAccount,
          // };
        // }
        // await transactionRunner.commitTransaction();
        // return { message: 'Kyc updated successfully' };
      // }
    } catch (error) {
      this.logger.error(error);
      if (transactionRunner) await transactionRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      if (transactionRunner) await transactionRunner.releaseTransaction();
    }
  }

  @Post('/auth-business-rep')
  @HttpCode(HttpStatus.OK)
  async authBusinessRep(
    @Body() body: CreateCompanyOwnerDto,
    @AuthUser() user: User,
  ) {
    let transactionRunner = null;
    try {
      transactionRunner = await this.transactionRunner.createTransaction();
      await transactionRunner.startTransaction();
      const transactionManager = transactionRunner.transactionManager;

      const kyc = await this.kycService.getCooperativeKyc(user.cooperative.id);
      const result = await this.cooperativeOwnerService.createMany(
        body.cooperativeOwners,
        kyc,
        user.cooperative,
        transactionManager,
      );

      if (result) {
        const res = await this.kycService.update(
          { id: kyc.id },
          { progress: 5, isCompleted: true },
          transactionManager,
        );
        // if (res) {
        //   const account = await this.walletService.getUserWallet(
        //     user.cooperative.id,
        //   );
          // if (account.account) {
          //   await transactionRunner.commitTransaction();
          //   return { message: 'Kyc completed successfully', data: result };
          // }
          // const updatedKyc = await this.kycService.getMerchantKyc(
          //   user.cooperative.id,
          // );

    //       await this.walletService.createVirtualAccountByKyc(
    //         updatedKyc,
    //         user,
    //         transactionManager,
    //       );
    //       await transactionRunner.commitTransaction();
    //       return {
    //         message: 'Kyc completed successfully',
    //         data: result,
    //       };
    //     }
    //     await transactionRunner.commitTransaction();
    //     return { message: 'Kyc updated successfully', data: result };
      }
    // } catch (error) {
    //   this.logger.error(error);
    //   if (transactionRunner) await transactionRunner.rollbackTransaction();
    //   throw new BadRequestException(error.message);
    } finally {
      if (transactionRunner) await transactionRunner.releaseTransaction();
    }
  }
}
