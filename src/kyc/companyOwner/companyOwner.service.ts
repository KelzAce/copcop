import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CooperativeOwner } from './companyOwner.entity';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { IFindKycComapnyOwners } from './companyOwner.interface';
import { CooperativeOwnerDto } from '../dto/authBusinessRep';
import { Kyc } from '../entities/kyc.entity';
import { Cooperative } from 'src/shared/entities/cooperative.entity';


@Injectable()
export class CooperativeOwnerService {
  private readonly logger = new Logger(CooperativeOwnerService.name);
  constructor(
    @InjectRepository(CooperativeOwner)
    private readonly cooperativeOwnerRepository: Repository<CooperativeOwner>,
  ) {}

  async getKycCompanyOwners(
    options: IFindKycComapnyOwners,
  ): Promise<Pagination<CooperativeOwner>> {
    const { kycId, cooperativeId } = options;
    const queryBuilder = this.cooperativeOwnerRepository.createQueryBuilder('c');
    queryBuilder
      .where('c.kycId = :kycId', { kycId })
      .andWhere('c.cooperativeId = :cooperativeId', { cooperativeId })
      .orderBy('c.createdAt', 'DESC');

    return paginate<CooperativeOwner>(queryBuilder, options);
  }

  async createMany(
    dataArray: CooperativeOwnerDto[],
    kyc: Kyc,
    cooperative: Cooperative,
    transactionManager: EntityManager,
  ): Promise<CooperativeOwner[]> {
    const createCooperativeOwners: CooperativeOwner[] = [];

    const cooperativeOwnerRepo = transactionManager.getRepository(CooperativeOwner);
    for (const data of dataArray) {
      const createdItem = data as Partial<CooperativeOwner>;
      createdItem.kyc = kyc;
      createdItem.cooperative = cooperative;
    //   const createCooperativeOwners = await this.cooperativeOwnerRepository.save(createdItem);
    //  createCooperativeOwners.push(createCooperativeOwners);
    }

    return createCooperativeOwners;
  }
}
