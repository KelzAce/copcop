export interface RoleDataDTO {
  team: boolean;
  users: boolean;
  integrations: boolean;
  channels: boolean;
}

export interface UpdateRoleDTO {
  role: string;
  data: {
    value: RoleDataDTO;
  };
}
