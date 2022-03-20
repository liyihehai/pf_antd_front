import { request } from 'umi';
/**
 * 取得所有菜单定义用于编辑 - 系统管理员功能
 */
export async function AllMenuTree(params: any) {
  return request<API.ResponseResult>('/api/menuSetting/allMenuTree', {
    method: 'GET',
    data: params || {},
  });
}
/**
 * 取得系统功能定义列表
 */
export async function getFEnter(params: any) {
  return request<API.ResponseResult>('/api/menuSetting/getFEnter', {
    method: 'GET',
    data: params || {},
  });
}

//保存菜单信息更改，含新增和更改
export async function saveMenuModify(params: any) {
  return request<API.ResponseResult>('/api/menuSetting/saveMenuModify', {
    method: 'POST',
    data: params || {},
  });
}
//删除菜单定义（物理删除）
export async function deleteMenu(params: any) {
  return request<API.ResponseResult>('/api/menuSetting/deleteMenu', {
    method: 'POST',
    data: params || {},
  });
}
//保存菜单功能，含更改及增加
export async function saveFunctionModify(params: any) {
  return request<API.ResponseResult>('/api/menuSetting/saveFunctionModify', {
    method: 'POST',
    data: params || {},
  });
}
//删除功能功能定义
export async function deleteFuncByCode(params: any) {
  return request<API.ResponseResult>('/api/menuSetting/deleteFuncByCode', {
    method: 'POST',
    data: params || {},
  });
}
//-------角色设置功能------------------------
//获取角色设置列表
export async function roleSetList(params: any) {
  return request<API.ResponseResult>('/api/roleSetting/roleSetList', {
    method: 'POST',
    data: params || {},
  });
}
//保存角色定义
export async function saveRoleModify(params: any) {
  return request<API.ResponseResult>('/api/roleSetting/saveRoleModify', {
    method: 'POST',
    data: params || {},
  });
}
//删除角色定义
export async function deleteRoleByCode(params: any) {
  return request<API.ResponseResult>('/api/roleSetting/deleteRoleByCode', {
    method: 'POST',
    data: params || {},
  });
}
//查询角色功能
export async function queryRoleFunctions(params: any) {
  return request<API.ResponseResult>('/api/roleSetting/queryRoleFunctions', {
    method: 'POST',
    data: params || {},
  });
}

//设置角色的功能
export async function saveRoleFunctions(params: any) {
  return request<API.ResponseResult>('/api/roleSetting/saveRoleFunctions', {
    method: 'POST',
    data: params || {},
  });
}
