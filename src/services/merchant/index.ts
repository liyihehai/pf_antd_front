import { request } from 'umi';
/**
 * 取得商户申请用于编辑 - 系统管理员功能
 */
export async function applyList(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantApply/applyList', {
    method: 'POST',
    data: params || {},
  });
}
/** 保存商户申请信息 */
export async function saveMerchantApply(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantApply/saveMerchantApply', {
    method: 'POST',
    data: params || {},
  });
}
/** 确认商户申请，商户状态变化：编辑状态 ==> 待审核状态 */
export async function confirmApply(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantApply/confirmApply', {
    method: 'POST',
    data: params || {},
  });
}
/**删除商户申请 */
export async function deleteApply(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantApply/deleteApply', {
    method: 'POST',
    data: params || {},
  });
}
/**发送商户申请的验证短信 */
export async function sendApplyVerifySM(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantApply/sendApplyVerifySM', {
    method: 'POST',
    data: params || {},
  });
}
/**
 * 取得商户申请用于审核 - 系统管理员功能
 */
export async function applyCheckList(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantApply/applyCheckList', {
    method: 'POST',
    data: params || {},
  });
}
/**手动分配商户申请给指定操作员，商户状态变化：待分配状态 ==> 待审核状态 */
export async function applyDistribute(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantApply/applyDistribute', {
    method: 'POST',
    data: params || {},
  });
}
/**驳回已提交待分配商户申请，商户状态变化：待分配状态 ==> 待编辑状态 */
export async function applyReject(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantApply/applyReject', {
    method: 'POST',
    data: params || {},
  });
}
/**拒绝待审核商户申请，商户状态变化：待审核状态 ==> 已拒绝状态 */
export async function applyRefuse(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantApply/applyRefuse', {
    method: 'POST',
    data: params || {},
  });
}
/**通过待审核商户申请，商户状态变化：待审核状态 ==> 已通过状态 */
export async function applyPass(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantApply/applyPass', {
    method: 'POST',
    data: params || {},
  });
}
