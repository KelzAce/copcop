import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getUser } from '../../test/test.helper';
import * as sinon from 'sinon';
import { Repository } from 'typeorm';
import { AccessService } from './access.service';
import { Access } from './entities/access.entity';

describe('AccessService', () => {
  let service: AccessService;
  let accessRepository;

  const user = getUser({});

  const ACCESS_TOKEN = getRepositoryToken(Access);

  const accessData = {
    user: user,
    merchant: user.merchant,
    isOwner: true,
    principalRole: {},
    adminstratorRole: {},
    supervisorRole: {},
    othersRole: {},
  };

  const access = {
    id: faker.string.uuid(),
    user: accessData.user,
    merchant: accessData.merchant,
    principalRole: accessData.principalRole,
    adminstratorRole: accessData.adminstratorRole,
    supervisorRole: accessData.supervisorRole,
    othersRole: accessData.othersRole,
  };
  const data = {
    user: user,
    merchant: user.merchant,
    isOwner: true,
    principalRole: {
      team: false,
      users: false,
      integrations: false,
      channels: false,
    },
    adminstratorRole: {
      team: false,
      users: false,
      integrations: false,
      channels: false,
    },
    supervisorRole: {
      team: false,
      users: false,
      integrations: false,
      channels: false,
    },
    othersRole: {
      team: false,
      users: false,
      integrations: false,
      channels: false,
    },
  };

  const merchantId = '1234edfgtr4345ygfghytr';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessService,
        {
          provide: ACCESS_TOKEN,
          useValue: {
            create: jest.fn().mockResolvedValue(access),
            save: jest.fn().mockResolvedValue(access),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockReturnThis(),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<AccessService>(AccessService);
    accessRepository = module.get<Repository<Access>>(ACCESS_TOKEN);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create a new access credentials', () => {
    it('when valid credientiald are provided', async () => {
      expect(await service.create(data)).toStrictEqual(access);
    });
  });

  it('fetch all access credentials by merchantId', async () => {
    sinon.stub(accessRepository, 'createQueryBuilder').returns({
      leftJoinAndSelect: sinon.stub().returns({
        leftJoinAndSelect: sinon.stub().returnsThis(),
        where: sinon.stub().returnsThis(),
        getOne: sinon.stub().returns(access),
      }),
    });

    const response = await service.findByMerchant(merchantId);
    expect(response).toBeDefined();
    expect(response?.id).toStrictEqual(access.id);
  });

  it('update team roles', async () => {
    sinon.stub(accessRepository, 'createQueryBuilder').returns({
      leftJoinAndSelect: sinon.stub().returns({
        leftJoinAndSelect: sinon.stub().returnsThis(),
        where: sinon.stub().returns({
          getOne: sinon.stub().returns(access),
        }),
      }),
    });
    jest
      .spyOn(accessRepository, 'save')
      .mockImplementation(
        (): Promise<any> => Promise.resolve({ ...access, ...updateData }),
      );
    const updateData = {
      role: 'adminstrator',
      data: {
        value: {
          users: true,
          team: true,
          integrations: true,
          channels: false,
        },
      },
    };

    const response = await service.updateRole(updateData, user);
    expect(response.adminstratorRole).toBeDefined();
    expect(typeof response.id).toBe('string');
    expect(response.id.length).toBeGreaterThan(0);
  });
});
