export interface RoleDataDTO {
  isExco: boolean;
  member: boolean;
  principal: boolean;
}

export interface UpdateRoleDTO {
  role: string;
  data: {
    value: RoleDataDTO;
  };
}
