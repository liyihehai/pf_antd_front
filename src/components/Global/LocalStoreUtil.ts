
/**
 * 写LocalStoreage
 * //storageType（缓存类型，1：localStorage, 2：sessionStorage，默认2）
 * @param key
 * @param value
 */
 export const setStorage = (key: string, value: string | object, storageType: number = 2): void =>{
    //KEY:缓存的KEY, value:缓存的值
    //对于相同的key，localStorage与sessionStorage互斥即一个KEY只能存在于两者之一
    if (!key || key.trim() === "") {
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
    }else{
        inputValue = value;
    }
    storage.setItem(key, inputValue);
}

/**
 * 读LocalStoreage
 * @param key
 * @param value
 */
export const getStorage = (key: string, storageType: number = 2): string => {
    if (!key || key === "") {
        return "";
    }
    //从缓存值获取字符串值
    let storage = localStorage;
    //指定存储于sessionStorage
    if (storageType === 2) {
        storage = sessionStorage;
    }
    const storageVal = storage.getItem(key);
    if (!storageVal) {
        return "";
    }
    return storageVal;
}

/**
 * 删除LocalStoreage
 * @param key
 */
export const removeStorage = (key: string, storageType: number = 2): void => {
    if (!key || key === "") {
        return;
    }
    //从缓存值获取字符串值
    let storage = localStorage;
    //指定存储于sessionStorage
    if (storageType === 2) {
        storage = sessionStorage;
    }
    storage.removeItem(key);
}

// 获取cookie
export const getCookie = (key: string): string =>{
    const name = key + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        const c = ca[i].trim();
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// 设置cookie,默认是30天
export const setCookie = (key: string, value: string, expired: number = 30): void =>{
    const d = new Date();
    d.setTime(d.getTime() + (expired * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = key + "=" + value + "; " + expires;
}

// 删除cookie
export const delCookie=(key: string): void => {
    const value = getCookie(key);
    if (value) {
        setCookie(key, value, -1)
    }
}