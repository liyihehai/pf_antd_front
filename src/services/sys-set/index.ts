import { request } from 'umi';
import { makeServerServiceUrl } from '@/components/Global/LocalStoreUtil';
/**
 * 取得所有菜单定义用于编辑 - 系统管理员功能
 */
export async function AllMenuTree(params: any) {
  return request<API.ResponseResult>('/api/sysset/menuSetting/allMenuTree', {
    method: 'GET',
    data: params || {},
  });
}
/**
 * 取得系统功能定义列表
 */
export async function getFEnter(params: any) {
  return request<API.ResponseResult>('/api/sysset/menuSetting/getFEnter', {
    method: 'GET',
    data: params || {},
  });
}

//保存菜单信息更改，含新增和更改
export async function saveMenuModify(params: any) {
  return request<API.ResponseResult>('/api/sysset/menuSetting/saveMenuModify', {
    method: 'POST',
    data: params || {},
  });
}
//删除菜单定义（物理删除）
export async function deleteMenu(params: any) {
  return request<API.ResponseResult>('/api/sysset/menuSetting/deleteMenu', {
    method: 'POST',
    data: params || {},
  });
}
//保存菜单功能，含更改及增加
export async function saveFunctionModify(params: any) {
  return request<API.ResponseResult>('/api/sysset/menuSetting/saveFunctionModify', {
    method: 'POST',
    data: params || {},
  });
}
//删除功能功能定义
export async function deleteFuncByCode(params: any) {
  return request<API.ResponseResult>('/api/sysset/menuSetting/deleteFuncByCode', {
    method: 'POST',
    data: params || {},
  });
}
//-------角色设置功能------------------------
//获取角色设置列表
export async function roleSetList(params: any) {
  return request<API.ResponseResult>('/api/sysset/roleSetting/roleSetList', {
    method: 'POST',
    data: params || {},
  });
}
//保存角色定义
export async function saveRoleModify(params: any) {
  return request<API.ResponseResult>('/api/sysset/roleSetting/saveRoleModify', {
    method: 'POST',
    data: params || {},
  });
}
//删除角色定义
export async function deleteRoleByCode(params: any) {
  return request<API.ResponseResult>('/api/sysset/roleSetting/deleteRoleByCode', {
    method: 'POST',
    data: params || {},
  });
}
//查询角色功能
export async function queryRoleFunctions(params: any) {
  return request<API.ResponseResult>('/api/sysset/roleSetting/queryRoleFunctions', {
    method: 'POST',
    data: params || {},
  });
}

//设置角色的功能
export async function saveRoleFunctions(params: any) {
  return request<API.ResponseResult>('/api/sysset/roleSetting/saveRoleFunctions', {
    method: 'POST',
    data: params || {},
  });
}
//-------操作员设置功能------------------------
//获取操作员设置列表
export async function operatorSetList(params: any) {
  return request<API.ResponseResult>('/api/sysset/operatorSetting/operatorSetList', {
    method: 'POST',
    data: params || {},
  });
}
//保存操作员设置
export async function saveOperatorModify(params: any) {
  return request<API.ResponseResult>('/api/sysset/operatorSetting/saveOperatorModify', {
    method: 'POST',
    data: params || {},
  });
}
export async function setPwsPriCheck(opeCode: string) {
  return request<API.ResponseResult>('/api/priCheck', {
    method: 'POST',
    data: { username: opeCode },
  });
}
//设置操作员密码
export async function setOperatorPws(params: any) {
  return request<API.ResponseResult>('/api/sysset/operatorSetting/setOperatorPws', {
    method: 'POST',
    data: params || {},
  });
}
//删除操作员设置
export async function deleteOperatorByCode(params: any) {
  return request<API.ResponseResult>('/api/sysset/operatorSetting/deleteOperatorByCode', {
    method: 'POST',
    data: params || {},
  });
}
//查询操作员角色
export async function queryOperatorRoles(params: any) {
  return request<API.ResponseResult>('/api/sysset/operatorSetting/queryOperatorRoles', {
    method: 'POST',
    data: params || {},
  });
}
//设置操作员的用户角色
export async function saveOperatorRoles(params: any) {
  return request<API.ResponseResult>('/api/sysset/operatorSetting/saveOperatorRoles', {
    method: 'POST',
    data: params || {},
  });
}
//通过操作员编码查询操作员功能信息
export async function queryOperatorFunctions(params: any) {
  return request<API.ResponseResult>('/api/sysset/operatorSetting/queryOperatorFunctions', {
    method: 'POST',
    data: params || {},
  });
}
//设置操作员的功能
export async function saveOperatorFunctions(params: any) {
  return request<API.ResponseResult>('/api/sysset/operatorSetting/saveOperatorFunctions', {
    method: 'POST',
    data: params || {},
  });
}
//----自动任务-------------
/**分页查询服务列表 */
export const taskJobPageList = (params: any) => {
  const url = makeServerServiceUrl('svr-api/pf-service/taskJobPageList');
  return request<API.ResponseResult>(url, {
    method: 'POST',
    data: params || {},
  });
};
//增加新任务
export const addTaskJob = (params: any) => {
  const url = makeServerServiceUrl('svr-api/pf-service/addTaskJob');
  return request<API.ResponseResult>(url, {
    method: 'POST',
    data: params || {},
  });
};
//更改任务
export const updateTaskJob = (params: any) => {
  const url = makeServerServiceUrl('svr-api/pf-service/updateTaskJob');
  return request<API.ResponseResult>(url, {
    method: 'POST',
    data: params || {},
  });
};
//删除任务
export const deleteTaskJob = (params: any) => {
  const url = makeServerServiceUrl('svr-api/pf-service/deleteTaskJob');
  return request<API.ResponseResult>(url, {
    method: 'POST',
    data: params || {},
  });
};
//设置等待执行
export const setTaskJobWaiting = (params: any) => {
  const url = makeServerServiceUrl('svr-api/pf-service/setTaskJobWaiting');
  return request<API.ResponseResult>(url, {
    method: 'POST',
    data: params || {},
  });
};
//设置暂停执行
export const setTaskJobPause = (params: any) => {
  const url = makeServerServiceUrl('svr-api/pf-service/setTaskJobPause');
  return request<API.ResponseResult>(url, {
    method: 'POST',
    data: params || {},
  });
};
//强制执行任务
export const forceExecute = (params: any) => {
  const url = makeServerServiceUrl('svr-api/pf-service/forceExecute');
  return request<API.ResponseResult>(url, {
    method: 'POST',
    data: params || {},
  });
};
