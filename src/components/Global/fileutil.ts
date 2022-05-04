/**返回文件的扩展名 */
export const getFileExtension = (fileName: string) => {
  if (!fileName || fileName.indexOf('.') < 0) return null;
  return fileName.substring(fileName.lastIndexOf('.') + 1);
};
/**
 2 * DataUrl转为File
 3 * @param {String} dataUrl - dataUrl地址
 4 * @param {String} fileName - file文件名
 5 */
export const dataURLtoFile = (dataUrl: string, fileName: string) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
};
