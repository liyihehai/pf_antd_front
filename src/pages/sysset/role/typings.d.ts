declare namespace Role {
  type RoleListItem = {
    id?: number;
    roleCode?: string;
    roleName?: string;
    sysroleList?: string;
    sysroleNameList?: string;
    roleState?: number;
    actionType?: number;
    functions?: string;
  };
}
