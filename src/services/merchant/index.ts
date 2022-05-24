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
/**返回商户列表数据 */
export async function merchantSettingList(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantSetting/merchantSettingList', {
    method: 'POST',
    data: params || {},
  });
}
/**保存商户设置 */
export async function saveMerchantSetting(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantSetting/saveMerchantSetting', {
    method: 'POST',
    data: params || {},
  });
}
/**通过编码查询特定商户信息 */
export async function queryMerchantDetail(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantSetting/queryMerchantDetail', {
    method: 'POST',
    data: params || {},
  });
}
/**设置商户启动服务 */
export async function setMerchantStart(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantSetting/setMerchantStart', {
    method: 'POST',
    data: params || {},
  });
}
/**设置商户下架 */
export async function setMerchantPause(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantSetting/setMerchantPause', {
    method: 'POST',
    data: params || {},
  });
}
/**设置商户下架 */
export async function setMerchantOffLine(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantSetting/setMerchantOffLine', {
    method: 'POST',
    data: params || {},
  });
}
/**取得商户UTI账户信息 */
export async function getUtiAccountByMerchantCode(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantSetting/getUtiAccountByMerchantCode', {
    method: 'POST',
    data: params || {},
  });
}
/**设置UTI账户 */
export async function merchantCreateUTIAccount(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantSetting/merchantCreateUTIAccount', {
    method: 'POST',
    data: params || {},
  });
}
/**商户UTI账户重置 */
export async function merchantUTIAccountReset(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantSetting/merchantUTIAccountReset', {
    method: 'POST',
    data: params || {},
  });
}
/**创建产生密钥对 */
export async function utiAccountGenKeys(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantSetting/utiAccountGenKeys', {
    method: 'POST',
    data: params || {},
  });
}
/**返回商户license列表数据 */
export async function merchantLicenseList(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantLicense/merchantLicenseList', {
    method: 'POST',
    data: params || {},
  });
}
/**保存商户许可信息 */
export async function saveMerchantLicense(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantLicense/saveMerchantLicense', {
    method: 'POST',
    data: params || {},
  });
}
/**确认商户许可，编辑->待执行->执行中 */
export async function confirmMerchantLicense(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantLicense/confirmMerchantLicense', {
    method: 'POST',
    data: params || {},
  });
}
/**删除商户许可 */
export async function deleteMerchantLicense(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantLicense/deleteMerchantLicense', {
    method: 'POST',
    data: params || {},
  });
}
/**商户UTI账户重置终端 */
export async function resetLicenseTerminal(params: any) {
  return request<API.ResponseResult>('/api/merchant/merchantLicense/resetLicenseTerminal', {
    method: 'POST',
    data: params || {},
  });
}
