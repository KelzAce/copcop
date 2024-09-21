import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getUser } from '../../test/test.helper';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';
import { ROLES_BUILDER_TOKEN } from 'nest-access-control';
import { UserService } from '../user/user.service';
import { UpdateRoleDTO } from './dto/role.dto';

describe('AccessController', () => {
  let controller: AccessController;

  const user = getUser({});

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
    supervisorRole: accessData.supervisorRole,
    othersRole: accessData.othersRole,
  };

  const MockAccessService = {
    createAccess: jest.fn().mockImplementation(() => access),
    updateRole: jest.fn(),
    findByMerchant: jest.fn().mockResolvedValue(access),
  };

  const MockUserService = {
    findByMerchant: jest.fn().mockResolvedValue(user),
    findByEmail: jest.fn().mockResolvedValue(user),
    findOneBy: jest.fn(),
    findOne: jest.fn().mockResolvedValueOnce(user),
    create: jest.fn().mockResolvedValue(user),
    update: jest.fn().mockResolvedValue(user),
    findById: jest.fn().mockResolvedValue(user),
  };

  const body: UpdateRoleDTO = {
    role: 'administrator',
    data: {
      value: { team: true, users: true, integrations: true, channels: false },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessController],
      providers: [
        AccessService,
        UserService,
        {
          provide: ROLES_BUILDER_TOKEN,
          useValue: {},
        },
      ],
    })
      .overrideProvider(AccessService)
      .useValue(MockAccessService)
      .overrideProvider(UserService)
      .useValue(MockUserService)
      .compile();

    controller = module.get<AccessController>(AccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('fetch access credentials', async () => {
    const res = await controller.fetchAccessCredentials(user);
    expect(res).toBeDefined();
    expect(res.message).toStrictEqual('fetched merchant data');
    expect(res.data.result?.id).toBe(access.id);
  });
  it('should update merchant Roles', async () => {
    const res = await controller.updateRole(body, user);
    expect(res.message).toStrictEqual('Data updated successfully.');
  });
  it('fetch user and group them by roles', async () => {
    const res = await controller.fetchGroupByRoles(user);
    expect(res.message).toStrictEqual('fetched merchants and group by role');
  });
});
