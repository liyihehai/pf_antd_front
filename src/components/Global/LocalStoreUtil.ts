export const login_session_key = 'login_session_key';
export const user_menu_functions = 'user_menu_functions';
export const app_env_data = 'app_env_data';

const user_menu_map = 'user_menu_map';
/**
 * 写LocalStoreage
 * //storageType（缓存类型，1：localStorage, 2：sessionStorage，默认2）
 * @param key
 * @param value
 */
export const setStorage = (key: string, value: string | object, storageType: number = 2): void => {
  //KEY:缓存的KEY, value:缓存的值
  //对于相同的key，localStorage与sessionStorage互斥即一个KEY只能存在于两者之一
  if (!key || key.trim() === '') {
    return;
  }
  if (!value) {
    return;
  }
  //存储对象,默认存储在localStorage中
  let storage = localStorage;
  //指定存储于sessionStorage
  if (storageType === 2) {
    storage = sessionStorage;
  }
  let inputValue = '';
  if (typeof value === 'object') {
    inputValue = JSON.stringify(value);
  } else {
    inputValue = value;
  }
  storage.setItem(key, inputValue);
};

/**
 * 读LocalStoreage
 * @param key
 * @param value
 */
export const getStorage = (key: string, storageType: number = 2): string => {
  if (!key || key === '') {
    return '';
  }
  //从缓存值获取字符串值
  let storage = localStorage;
  //指定存储于sessionStorage
  if (storageType === 2) {
    storage = sessionStorage;
  }
  const storageVal = storage.getItem(key);
  if (!storageVal) {
    return '';
  }
  return storageVal;
};

/**
 * 删除LocalStoreage
 * @param key
 */
export const removeStorage = (key: string, storageType: number = 2): void => {
  if (!key || key === '') {
    return;
  }
  //从缓存值获取字符串值
  let storage = localStorage;
  //指定存储于sessionStorage
  if (storageType === 2) {
    storage = sessionStorage;
  }
  storage.removeItem(key);
};

// 获取cookie
export const getCookie = (key: string): string => {
  const name = key + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

// 设置cookie,默认是30天
export const setCookie = (key: string, value: string, expired: number = 30): void => {
  const d = new Date();
  d.setTime(d.getTime() + expired * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d.toUTCString();
  document.cookie = key + '=' + value + '; ' + expires;
};

// 删除cookie
export const delCookie = (key: string): void => {
  const value = getCookie(key);
  if (value) {
    setCookie(key, value, -1);
  }
};

//返回当前操作员信息
export const getCurrentOperator = (): API.CurrentUser | undefined => {
  try {
    const userString = getStorage(login_session_key);
    if (userString) {
      const current_user: API.CurrentUser = JSON.parse(userString);
      return current_user;
    }
  } catch (error) {}
  return undefined;
};

//返回菜单信息
export const getStoreMenu = () => {
  try {
    const munuString = getStorage(user_menu_functions);
    if (munuString) {
      const current_menu = JSON.parse(munuString);
      return current_menu;
    }
  } catch (error) {}
  return undefined;
};

const generateMenuMap = (dMap: Map<string, GLOBAL.MenuFunc>, data: GLOBAL.MenuFunc[]) => {
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    dMap.set(item.path, item);
    if (item.children) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      generateMenuMap(dMap, item.children);
    }
  }
};

//保存菜单MAP结构
export const saveMenuToMap = (data: GLOBAL.MenuFunc[]) => {
  const dMap = new Map<string, GLOBAL.MenuFunc>();
  generateMenuMap(dMap, data);
  const map_string = JSON.stringify([...dMap]);
  setStorage(user_menu_map, map_string);
};

//按路径查询菜单或功能
export const getMenuFunctiong = (path: string): GLOBAL.MenuFunc | undefined => {
  const map_string = getStorage(user_menu_map);
  if (map_string) {
    const dMap = new Map<string, GLOBAL.MenuFunc>();
    const menuList: [] = JSON.parse(map_string);
    if (menuList) {
      menuList.forEach((menu) => {
        dMap.set(menu[0], menu[1]);
      });
    }
    const item = dMap.get(path);
    return item;
  }
  return undefined;
};

export const getAppEnvData = () => {
  try {
    const ss = getStorage(app_env_data);
    if (ss) {
      const envData: API.EnvData = JSON.parse(ss);
      return envData;
    }
  } catch (error) {}
  return undefined;
};

export const makeStaticUrl = (url: string) => {
  const appEnvData = getAppEnvData();
  return appEnvData?.uploadStaticRoot + '/' + url;
};
