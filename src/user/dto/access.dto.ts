import { RoleDataDTO } from '../../access/dto/role.dto';

export const defaultAccess: RoleDataDTO = {
  team: false,
  users: false,
  integrations: false,
  channels: false,
};

export const defaultPrincipalAccess: RoleDataDTO = {
  team: true,
  users: true,
  integrations: true,
  channels: true,
};
