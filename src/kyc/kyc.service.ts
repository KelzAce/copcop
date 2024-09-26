import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { KYC } from "./entities/kyc.entity";

@Injectable()
export class KYCService {
  constructor(
    @InjectRepository(KYC)
    private kycRepository: Repository<KYC>,
  ) {}

  // async submitKYC(userId: number, bvn: string, bankAccount: string, photoUrl: string) {
  //   const kyc = this.kycRepository.create({ userId, bvn, bankAccount, photoUrl });
  //   return this.kycRepository.save(kyc);
  // }
}
