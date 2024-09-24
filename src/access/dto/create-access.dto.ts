import { IsBoolean, IsObject } from 'class-validator';
import { RoleDataDTO } from './role.dto';
import { Cooperative } from 'src/shared/entities/cooperative.entity';

export class CreateAccessDto {

  @IsObject()
  isExco: RoleDataDTO;

  @IsObject()
  othersRole: RoleDataDTO;
}
