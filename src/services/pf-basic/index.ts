import { request } from 'umi';

//上传图片文件到文件服务器，append = {srcFile = ...},srcFiles是要删除的原文件
export async function uploadImage(params: any, append?: any) {
  const formData = new FormData();
  formData.append('files', params.file);
  if (append) {
    Object.keys(append).forEach((ele) => {
      const item = (append as any)[ele];
      if (item !== undefined && item !== null) {
        formData.append(ele, typeof item === 'object' ? JSON.stringify(item) : item);
      }
    });
  }
  return request<API.ResponseResult>('/api/pfbasic/uploadImage', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params: { ...params },
    data: formData,
  });
}
//查询地址的经纬度
export async function queryAddressGeocode(params: any) {
  return request<API.ResponseResult>('/api/pfbasic/queryAddressGeocode', {
    method: 'POST',
    data: params || {},
  });
}
