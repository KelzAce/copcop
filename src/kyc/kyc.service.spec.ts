import { Test, TestingModule } from '@nestjs/testing';
import { KycService } from './kyc.service';
import { getKyc, getMerchant } from '../../test/test.helper';
import { Kyc } from './entities/kyc.entity';

describe('KycService', () => {
  let service: KycService;

  const merchant = getMerchant({});

  const kyc = getKyc({ merchant });

  const partialKyc: Partial<Kyc> = {
    bankName: kyc.bankName,
    acctNo: kyc.acctNo,
    acctName: kyc.acctName,
    kycType: kyc.kycType,
    progress: 1,
  };

  const MockKycService = {
    getMerchantKyc: jest.fn().mockResolvedValue(kyc),
    create: jest.fn().mockResolvedValue(kyc),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KycService],
    })
      .overrideProvider(KycService)
      .useValue(MockKycService)
      .compile();

    service = module.get<KycService>(KycService);
  });

  describe('All kyc service tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should find merchant kyc', async () => {
      expect(await service.getMerchantKyc(merchant.id)).toStrictEqual(kyc);
    });

    it('should create a new kyc', async () => {
      expect(await service.create(partialKyc)).toStrictEqual(kyc);
    });
  });
});
