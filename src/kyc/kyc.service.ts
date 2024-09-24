import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Kyc } from './entities/kyc.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { VerifyBankDetailsDto, VerifyBvnDto } from './dto/bankInfo';
import axios from 'axios';
import { BankCode } from './kyc.interface';
import {
  VerifyAccountResponse,
  VerifyBvnResponse,
} from './helpers/returnTypes';

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);
  constructor(
    @InjectRepository(Kyc)
    private readonly kycRepository: Repository<Kyc>,
    private readonly configService: ConfigService,
  ) {}

  async getCooperativeKyc(id: string): Promise<Kyc> {
    const kyc = await this.kycRepository
      .createQueryBuilder('kyc')
      .innerJoinAndSelect('kyc.cooperative', 'cooperative')
      .where('kyc.cooperativeId = :id', { id: id })
      .andWhere('kyc.createdAt IS NOT NULL')
      .getOne();
    return kyc;
  }

  async create(data: Partial<Kyc>): Promise<Kyc> {
    const createdKyc = await this.kycRepository.save(data);
    return createdKyc;
  }

  async update(
    query: FindOptionsWhere<Kyc>,
    data: Partial<Kyc>,
    transactionManager = null,
  ) {
    if (transactionManager) {
      const kycRepo = transactionManager.getRepository(Kyc);
      const result = await kycRepo.update(query, data);
      return result;
    } else {
      const result = await this.kycRepository.update(query, data);
      return result;
    }
  }

  async getBankCodes(): Promise<BankCode[]> {
    const URL = `https://api.prembly.com/identitypass/verification/bank_account/bank_code`;

    try {
      const res = await axios({
        method: 'get',
        url: URL,
        headers: {
          'x-api-key': this.configService.get<string>('identityPassPrivateKey'),
          'app-id': this.configService.get<string>('identityPassAppId'),
        },
      });
      const result: BankCode[] = res.data.data.map((item) => ({
        label: item.name,
        value: item.code,
      }));
      return result;
    } catch (err) {
      this.logger.warn(err);
    }
  }

  async verifyAccountDetails(
    data: VerifyBankDetailsDto,
  ): Promise<VerifyAccountResponse> {
    const URL = `https://api.prembly.com/identitypass/verification/bank_account/basic`;

    try {
      const res = await axios({
        method: 'post',
        url: URL,
        data: data,
        headers: {
          'x-api-key': this.configService.get<string>('identityPassPrivateKey'),
          'app-id': this.configService.get<string>('identityPassAppId'),
        },
      });
      return res.data;
    } catch (err) {
      this.logger.warn(err);
      throw new BadRequestException(err.message);
    }
  }

  async bvnVerification(data: VerifyBvnDto): Promise<VerifyBvnResponse> {
    const URL = `https://api.prembly.com/identitypass/verification/bvn_validation`;
    try {
      const res = await axios({
        method: 'post',
        url: URL,
        data: data,
        headers: {
          'x-api-key': this.configService.get<string>('identityPassPrivateKey'),
          'app-id': this.configService.get<string>('identityPassAppId'),
        },
      });

      return res.data;
    } catch (err) {
      this.logger.warn(err);
      throw new BadRequestException(err.message);
    }
  }
}
