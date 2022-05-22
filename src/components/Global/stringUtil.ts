export const appendURL = (rootString?: string, urlString?: string) => {
  let root = rootString ?? '';
  if (root.length > 0) {
    if (root[length - 1] == '/') root = root.substring(root.length - 1);
  }
  let linkWord = '/';
  const url = urlString ?? '';
  if (url.indexOf('/') == 0) linkWord = '';
  return root + linkWord + url;
};

const _charStr = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';

function RandomIndex(min: any, max: any, i: any) {
  let index = Math.floor(Math.random() * (max - min + 1) + min);
  const numStart = _charStr.length - 10;
  //如果字符串第一位是数字，则递归重新获取
  if (i == 0 && index >= numStart) {
    index = RandomIndex(min, max, i);
  }
  //返回最终索引值
  return index;
}

export const genRandomCode = (len: number) => {
  const min = 0,
    max = _charStr.length - 1;
  let _str = '';
  //循环生成字符串
  for (let i = 0, index; i < len; i++) {
    index = RandomIndex(min, max, i);
    _str += _charStr[index];
  }
  return _str;
};
