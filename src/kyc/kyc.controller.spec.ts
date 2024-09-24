import { Test, TestingModule } from '@nestjs/testing';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { CompanyOwnerService } from './companyOwner/companyOwner.service';
import { Kyc } from './entities/kyc.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CompanyOwner } from './companyOwner/companyOwner.entity';
import { ConfigService } from '@nestjs/config';
import { ROLES_BUILDER_TOKEN } from 'nest-access-control';
import * as sinon from 'sinon';
import {
  getCompanyOwner,
  getKyc,
  getMerchant,
  getUser,
  getWallet,
} from '../../test/test.helper';
import { faker } from '@faker-js/faker';
import { DataSource, Repository } from 'typeorm';
import { SocialMediaDto } from './dto/socialMediaDto';
import { SocialMediaService } from './socialMedia/socialMedia.service';
import { MerchantSocialMedia } from './socialMedia/socialMedia.entity';
import { WalletService } from '../wallet/wallet.service';
import { Wallet } from '../wallet/entities/wallet.entity';
import { LedgerHistory } from '../shared/entities/ledger-history.entity';
import { SystemWalletEntity } from '../shared/entities/system-wallet.entity';
import { BankDetails } from '../shared/entities/bank-details.entity';
import { ResourceLock } from '../resource-lock/resource-lock.entity';
import { VirtualAccounts } from '../shared/entities/virtual-accounts.entity';
import { Ledger } from '../shared/entities/ledger.entity';
import { PaymentProviderService } from '../payment-provider/payment-provider/payment-provider.service';
import { ResourceLockService } from '../resource-lock/resource-lock.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BankCodesService } from '../bankCodes/bankCodes.service';
import { BankCodes } from '../bankCodes/entity/bankCodes.entity';
import { DbTransactionFactory } from '../shared/services/TransactionManager/TransactionManager';
import { TransactionRunner } from '../shared/services/TransactionManager/TransactionManager.service';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockImplementation((querybuilder) => querybuilder),
}));

class MockQueryRunner {
  connect() {
    return Promise.resolve();
  }

  startTransaction() {
    return Promise.resolve();
  }

  commitTransaction() {
    return Promise.resolve();
  }

  rollbackTransaction() {
    return Promise.resolve();
  }

  release() {
    return jest.fn();
  }
}

class MockDataSource {
  createQueryRunner() {
    return new MockQueryRunner();
  }
}

describe('KycController', () => {
  let controller: KycController;
  const KYC_REPOSITORY_TOKEN = getRepositoryToken(Kyc);
  const COMPANY_OWNER_REPOSITORY_TOKEN = getRepositoryToken(CompanyOwner);
  const SOCIAL_MEDIA_REPOSITORY_TOKEN = getRepositoryToken(MerchantSocialMedia);
  const WALLET_REPOSITORY_TOKEN = getRepositoryToken(Wallet);
  const BANKCODE_REPOSITORY_TOKEN = getRepositoryToken(BankCodes);
  let companyOwnerRepository;
  let service: KycService;

  const MockBvnVerificationResponse = {
    status: true,
    detail: 'Verification Successfull',
    response_code: '00',
    bvn_data: {
      firstName: 'John',
      middleName: 'Doe',
      lastName: 'Jane',
      dateOfBirth: '01-Jan-2000',
      phoneNumber: '08012345678',
    },
    source: 'test',
    user_info: null,
    request_data: { number: '1234567890' },
  };

  const MockBankDetailsVerificationResponse = {
    status: true,
    detail: 'Verification Successful',
    account_data: {
      account_number: '4444444444',
      account_name: 'Test Account',
    },
  };
  const user = getUser({});

  const merchant = getMerchant({});

  const kyc = getKyc({ merchant });

  const companyOwner = getCompanyOwner({ kyc });

  const wallet = getWallet({ merchant: user.merchant });

  const kycStep1 = {
    bankName: kyc.bankName,
    acctNo: kyc.acctNo,
    acctName: kyc.acctName,
    kycType: kyc.kycType,
    businessCategory: kyc.businessCategory,
    bvn: kyc.bvn,
  };
  const sociaMedia: SocialMediaDto = {
    facebookLink: faker.internet.url(),
    instagramLink: faker.internet.url(),
    tiktokLink: faker.internet.url(),
    twitterLink: faker.internet.url(),
    linkedinLink: faker.internet.url(),
    websiteLink: faker.internet.url(),
  };

  const kycStep2 = {
    tradingName: kyc.tradingName,
    businessName: kyc.businessName,
    phone: kyc.phone,
    supportPhone: kyc.supportPhone,
    email: kyc.email,
    supportEmail: kyc.supportEmail,
    companyRegistrationNumber: kyc.companyRegistrationNumber,
    description: kyc.description,
    trusteeBvn: kyc.bvn,
    trustee2Bvn: kyc.bvnSecondTrustee,
    estimatedMonthlySale: kyc.estimatedMonthlySale,
    businessType: kyc.businessType,
    socialMedia: sociaMedia,
  };

  const kycStep3 = {
    country: kyc.country,
    address: kyc.address,
    city: kyc.city,
    state: kyc.state,
    businessType: kyc.businessType,
    identityDocUrl: kyc.identityDocUrl,
    identityDocType: kyc.identityDocType,
    identityDocNumber: kyc.identityDocNumber,
    socialMedia: sociaMedia,
  };

  const kycStep4 = {
    certIncorpTrusteeUrl: kyc.certIncorpTrusteeUrl,
    incorpTrusteeDocUrl: kyc.incorpTrusteeDocUrl,
    constitutionDocUrl: kyc.constitutionDocUrl,
    identityDocUrl: kyc.identityDocUrl,
    identityDocType: kyc.identityDocType,
    identityDocNumber: kyc.identityDocNumber,
    certIncorpUrl: kyc.certIncorpUrl,
    operatingLicenseUrl: kyc.operatingLicenseUrl,
    memorandumUrl: kyc.memorandumUrl,
    additionalDocUrl: kyc.additionalDocUrl,
  };

  const kycStep5 = {
    companyOwners: [
      {
        ownsMoreThan5PercentageOfCompany: false,
        isBusinessOwner: false,
        bvn: faker.string.numeric(11),
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        state: faker.location.state(),
        city: faker.location.city(),
        address: faker.location.streetAddress(),
        docUrl: faker.image.url(),
        docType: "Driver's Lisence",
        docNumber: faker.string.numeric(11),
        kyc: null,
      },
    ],
  };
  const BankList = [
    {
      id: 302,
      name: '9mobile 9Payment Service Bank',
      code: '120001',
    },
    {
      id: 174,
      name: 'Abbey Mortgage Bank',
      code: '801',
    },
    {
      id: 188,
      name: 'Above Only MFB',
      code: '51204',
    },
  ];

  const MockKycService = {
    createQueryBuilder: jest.fn(() => ({
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnThis(),
    })),
    save: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
  };

  const MockCompanyOwnerService = {
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
    })),
    save: jest.fn().mockReturnThis(),
  };

  const MockSocialMediaService = {
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnThis(),
    })),
    save: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
  };

  const MockWalletService = {
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockReturnThis(),
    })),
    findOne: jest.fn().mockResolvedValue(wallet),
  };

  const MockBankCodeService = {
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnThis(),
    })),
    find: jest.fn().mockReturnThis(),
    save: jest.fn().mockReturnThis(),
  };

  jest.mock('typeorm', () => ({
    DataSource: MockDataSource,
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KycController],
      providers: [
        KycService,
        CompanyOwnerService,
        ConfigService,
        SocialMediaService,
        WalletService,
        ResourceLockService,
        EventEmitter2,
        BankCodesService,
        DbTransactionFactory,
        TransactionRunner,
        { provide: DataSource, useClass: MockDataSource },
        {
          provide: KYC_REPOSITORY_TOKEN,
          useValue: MockKycService,
        },
        {
          provide: COMPANY_OWNER_REPOSITORY_TOKEN,
          useValue: MockCompanyOwnerService,
        },
        {
          provide: SOCIAL_MEDIA_REPOSITORY_TOKEN,
          useValue: MockSocialMediaService,
        },
        {
          provide: WALLET_REPOSITORY_TOKEN,
          useValue: MockWalletService,
        },
        {
          provide: BANKCODE_REPOSITORY_TOKEN,
          useValue: MockBankCodeService,
        },
        {
          provide: getRepositoryToken(Ledger),
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(VirtualAccounts),
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(LedgerHistory),
          useValue: {},
        },
        {
          provide: getRepositoryToken(SystemWalletEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(BankDetails),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ResourceLock),
          useValue: {},
        },
        {
          provide: PaymentProviderService,
          useValue: {
            getCustomerDetails: jest.fn(() => Promise.resolve({})),
            createCustomerAccount: jest.fn(() => Promise.resolve({})),
            getActivePaymentBanks: jest.fn(() => Promise.resolve({})),
            generateVirtualAccount: jest.fn(() => Promise.resolve({})),
            mainAccountDetails: jest.fn(() => Promise.resolve({})),
          },
        },
        {
          provide: ROLES_BUILDER_TOKEN,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<KycController>(KycController);
    companyOwnerRepository = module.get<Repository<CompanyOwner>>(
      COMPANY_OWNER_REPOSITORY_TOKEN,
    );
    service = module.get<KycService>(KycService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('All Kyc verification tests', () => {
    it('should return list of banks', async () => {
      jest
        .spyOn(controller, 'getBanks')
        .mockImplementationOnce((): Promise<any> => Promise.resolve(BankList));

      const res = await controller.getBanks();
      expect(res).toBeDefined;
      expect(res.length).toStrictEqual(3);
    });

    it('should verify bvn', async () => {
      jest
        .spyOn(service, 'bvnVerification')
        .mockResolvedValue(MockBvnVerificationResponse);

      const res = await controller.verifyBvn({
        number: faker.string.numeric(11),
      });
      expect(res.message).toBe('Bvn verified successfully');
      expect(res.data.bvn_data.firstName).toStrictEqual('John');
    });

    it('should verify bank details', async () => {
      jest
        .spyOn(service, 'verifyAccountDetails')
        .mockResolvedValue(MockBankDetailsVerificationResponse);

      const res = await controller.verifyBankDetails({
        number: faker.string.numeric(11),
        bank_code: faker.string.numeric(3),
      });

      expect(res.message).toBe('Bank Details verified successfully');
      expect(res.data.account_data.account_number).toBe('4444444444');
    });

    // it('should verify bank details', async () => {
    //   jest
    //     .spyOn(controller, 'sendPaymentAuthCode')
    //     .mockImplementationOnce(
    //       (): Promise<any> =>
    //         Promise.resolve({ message: 'Otp has been sent to your number' }),
    //     );

    //   const res = await controller.sendPaymentAuthCode({
    //     phone: faker.phone.number(),
    //   });
    //   expect(res.message).toStrictEqual('Otp has been sent to your number');
    // });

    // it('should verify phone number', async () => {
    //   jest
    //     .spyOn(controller, 'verifyPaymentAuthCode')
    //     .mockImplementationOnce(
    //       (): Promise<any> =>
    //         Promise.resolve({ message: 'Phone number verified Successfully' }),
    //     );

    //   const res = await controller.verifyPaymentAuthCode({
    //     code: faker.random.numeric(6),
    //     phone: faker.phone.number(),
    //   });
    //   expect(res.message).toStrictEqual('Phone number verified Successfully');
    // });
  });

  describe('All Kyc flow test', () => {
    it('should get merchant kyc', async () => {
      jest.spyOn(controller, 'getMerchantKyc').mockImplementationOnce(
        (): Promise<any> =>
          Promise.resolve({
            message: 'Successful',
            data: kyc,
          }),
      );

      const res = await controller.getMerchantKyc(user);
      expect(res.message).toStrictEqual('Successful');
    });

    it('should complete create a kyc', async () => {
      jest.spyOn(controller, 'addBankDetails').mockImplementationOnce(
        (): Promise<any> =>
          Promise.resolve({
            message: 'Successful',
            data: kyc,
          }),
      );

      const res = await controller.addBankDetails(kycStep1, user);
      expect(res.message).toStrictEqual('Successful');
    });

    it('should complete kyc step 2', async () => {
      jest
        .spyOn(controller, 'addBusinessInfo')
        .mockImplementationOnce(
          (): Promise<any> =>
            Promise.resolve({ message: 'Kyc updated successfully' }),
        );

      const res = await controller.addBusinessInfo(kycStep2, user);
      expect(res.message).toStrictEqual('Kyc updated successfully');
    });

    it('should complete kyc step 3', async () => {
      jest
        .spyOn(controller, 'addAddtionalInfo')
        .mockImplementationOnce(
          (): Promise<any> =>
            Promise.resolve({ message: 'Kyc updated successfully' }),
        );

      const res = await controller.addAddtionalInfo(kycStep3, user);
      expect(res.message).toStrictEqual('Kyc updated successfully');
    });

    it('should complete kyc step 4', async () => {
      jest
        .spyOn(controller, 'uploadDocuments')
        .mockImplementationOnce(
          (): Promise<any> =>
            Promise.resolve({ message: 'Kyc updated successfully' }),
        );

      const res = await controller.uploadDocuments(kycStep4, user);
      expect(res.message).toStrictEqual('Kyc updated successfully');
    });
  });

  describe('All Kyc company owner tests', () => {
    it(`should get a kyc's company owners`, async () => {
      sinon.stub(companyOwnerRepository, 'createQueryBuilder').returns({
        where: sinon.stub().returnsThis(),
        andWhere: sinon.stub().returnsThis(),
        orderBy: sinon.stub().returnsThis(),
        items: Array(1).fill(companyOwner),
      });

      const res = await controller.getKycCompanyOwners(
        user,
        faker.string.uuid(),
      );
      const data = res.data;
      expect(res).toBeDefined();
      expect(res.message).toStrictEqual(
        'Company Owners retrieved successfully',
      );
      expect(data.items.length).toStrictEqual(1);
    });

    it('should create company owners of kyc', async () => {
      jest.spyOn(controller, 'authBusinessRep').mockImplementationOnce(
        (): Promise<any> =>
          Promise.resolve({
            message: 'Kyc updated successfully',
            data: [companyOwner],
          }),
      );

      const res = await controller.authBusinessRep(kycStep5, user);
      expect(res).toBeDefined();
      expect(res.message).toStrictEqual('Kyc updated successfully');
      expect(res.data.length).toStrictEqual(1);
    });
  });
});
