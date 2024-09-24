import { IPaginationOptions } from 'nestjs-typeorm-paginate';

export interface IFindKycComapnyOwners extends IPaginationOptions {
  kycId: string;
  cooperativeId: string;
}
