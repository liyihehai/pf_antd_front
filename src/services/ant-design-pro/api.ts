// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { AES_ECB_encrypt } from '@/secret';
import {
  setStorage,
  getStorage,
  removeStorage,
  login_session_key,
  user_menu_functions,
} from '@/components/Global/LocalStoreUtil';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  /*
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
  */
  const userString = getStorage(login_session_key);
  if (userString) {
    const current_user: API.CurrentUser = JSON.parse(userString);
    return { data: { ...current_user } };
  }
  return undefined;
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  /*
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
  */
  removeStorage(login_session_key);
  removeStorage(user_menu_functions);
}

/** 登录接口 POST /api/login/account|mobile */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  const { type } = body;
  const result = await request<API.ResponseResult>('/api/priCheck', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
  if (result.success) {
    const loginParam = {
      ...body,
      password: AES_ECB_encrypt(body.password, result.data),
    };
    const checkResult = await request<API.ResponseResult>('/api/login/' + type, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: loginParam,
      ...(options || {}),
    });
    if (checkResult.success) {
      const current_user: API.CurrentUser = {};
      current_user.name = checkResult.data.OperatorInfo.operatorName;
      current_user.userid = checkResult.data.OperatorInfo.operatorCode;
      current_user.signature = checkResult.data.OperatorInfo.token;
      setStorage(login_session_key, current_user);
      setStorage(user_menu_functions, checkResult.data.MenuFunctions);
      return {
        status: 'ok',
        type: type,
        currentAuthority: '',
      };
    }
  }
  const errResult = {
    status: 'error',
    type: type,
    currentAuthority: '',
  };
  return errResult;
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
