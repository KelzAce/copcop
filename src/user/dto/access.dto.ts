import { RoleDataDTO } from '../../access/dto/role.dto';

export const defaultAccess: RoleDataDTO = {
  isExco: false,
  member: true,
  principal: false
};

export const defaultPrincipalAccess: RoleDataDTO = {
  isExco: true,
  member: false,
  principal: true,
};
