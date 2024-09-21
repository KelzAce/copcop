import { IsBoolean, IsObject } from 'class-validator';
// import { Merchant } from '../../shared/entities/merchant.entity';
import { RoleDataDTO } from './role.dto';

export class CreateAccessDto {
  // merchant: Merchant;

  @IsBoolean()
  isOwner: boolean;

  @IsObject()
  principalRole: RoleDataDTO;

  @IsObject()
  adminstratorRole: RoleDataDTO;

  @IsObject()
  supervisorRole: RoleDataDTO;

  @IsObject()
  othersRole: RoleDataDTO;
}
