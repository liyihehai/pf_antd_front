import { request } from 'umi';
/**
 * 取得所有菜单定义用于编辑 - 系统管理员功能
 */
export async function AllMenuTree(params: any) {
  return request<API.ResponseResult>('/api/systemSetting/allMenuTree', {
    method: 'GET',
    data: params || {},
  });
}
/**
 * 取得系统功能定义列表
 */
export async function getFEnter(params: any) {
  return request<API.ResponseResult>('/api/systemSetting/getFEnter', {
    method: 'GET',
    data: params || {},
  });
}

//保存菜单信息更改，含新增和更改
export async function saveMenuModify(params: any) {
  return request<API.ResponseResult>('/api/systemSetting/saveMenuModify', {
    method: 'POST',
    data: params || {},
  });
}
//删除菜单定义（物理删除）
export async function deleteMenu(params: any) {
  return request<API.ResponseResult>('/api/systemSetting/deleteMenu', {
    method: 'POST',
    data: params || {},
  });
}
//保存菜单功能，含更改及增加
export async function saveFunctionModify(params: any) {
  return request<API.ResponseResult>('/api/systemSetting/saveFunctionModify', {
    method: 'POST',
    data: params || {},
  });
}
//删除功能功能定义
export async function deleteFuncByCode(params: any) {
  return request<API.ResponseResult>('/api/systemSetting/deleteFuncByCode', {
    method: 'POST',
    data: params || {},
  });
}
