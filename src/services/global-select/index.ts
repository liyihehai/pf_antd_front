import { request } from 'umi';
/**
 * 查询当前所有可用的操作员列表(不分页)
 */
export async function loadSelectOperator(params: any) {
  return request<API.ResponseResult>('/api/sysset/select/loadSelectOperator', {
    method: 'POST',
    data: params || {},
  });
}
