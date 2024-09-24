import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import {
  getCompanyOwner,
  getKyc,
  getMerchant,
} from '../../../test/test.helper';
import { CompanyOwnerService } from './companyOwner.service';
import { CompanyOwnerDto } from '../dto/authBusinessRep';
import { EntityManager } from 'typeorm';

describe('CompanyOWnerService', () => {
  let service: CompanyOwnerService;

  const merchant = getMerchant({});
  const kyc = getKyc({ merchant });
  let entityManager: EntityManager;

  const companyOwner = getCompanyOwner({ kyc });

  const partialCompanyOwner: CompanyOwnerDto[] = [
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
    },
  ];

  const MockCompanyOwnerService = {
    getKycCompanyOwners: jest.fn().mockResolvedValue([companyOwner]),
    createMany: jest.fn().mockResolvedValue([companyOwner]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyOwnerService],
    })
      .overrideProvider(CompanyOwnerService)
      .useValue(MockCompanyOwnerService)
      .compile();

    service = module.get<CompanyOwnerService>(CompanyOwnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find kyc company owners', async () => {
    expect(
      await service.getKycCompanyOwners({
        kycId: kyc.id,
        merchantId: merchant.id,
        limit: 10,
        page: 1,
      }),
    ).toStrictEqual([companyOwner]);
  });

  it('should creates many companyOwners', async () => {
    expect(
      await service.createMany(
        partialCompanyOwner,
        kyc,
        merchant,
        entityManager,
      ),
    ).toStrictEqual([companyOwner]);
  });
});
