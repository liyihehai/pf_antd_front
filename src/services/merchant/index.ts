import { request } from 'umi';
/**
 * 取得所有菜单定义用于编辑 - 系统管理员功能
 */
export async function applyList(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantApply/applyList', {
    method: 'POST',
    data: params || {},
  });
}

export async function saveMerchantApply(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantApply/saveMerchantApply', {
    method: 'POST',
    data: params || {},
  });
}
