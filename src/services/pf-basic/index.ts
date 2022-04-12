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
//分页取得数据字典子项列表（分页，含除删除以外的所有子项）
export async function getLibraryItemList(params: any) {
  return request<API.ResponseResult>('/api/basicInfo/library/getLibraryItemList', {
    method: 'POST',
    data: params || {},
  });
}
//保存数据字典分类
export async function saveLibraryItem(params: any) {
  return request<API.ResponseResult>('/api/basicInfo/library/saveLibraryItem', {
    method: 'POST',
    data: params || {},
  });
}
//删除数据字典分项
export async function delLibraryItem(params: any) {
  return request<API.ResponseResult>('/api/basicInfo/library/delLibraryItem', {
    method: 'POST',
    data: params || {},
  });
}
//按分类代码取得有效的分项集合
export async function getValidLibItems(params: any) {
  return request<API.ResponseResult>('/api/basicInfo/library/getValidLibItems', {
    method: 'POST',
    data: params || {},
  });
}