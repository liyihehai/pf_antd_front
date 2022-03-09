import { request } from 'umi';
/**
 * 取得所有菜单定义用于编辑 - 系统管理员功能
 */
export async function AllMenuTree(params: any) {
  return request<API.ResponseResult>('/api/systemSetting/allMenuTree', {
    method: 'GET',
    ...(params || {}),
  });
}
