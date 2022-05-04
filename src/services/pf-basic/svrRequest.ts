//辅助服务请求功能封装
import { request } from 'umi';
import { makeUploadServiceUrl } from '@/components/Global/LocalStoreUtil';

export type FileUploadProp = {
  appCode: string;
  funcCode: string;
  isTmp: number;
};

/**向文件服务器上传文件 */
export const uploadFileToSrv = (fuProp: FileUploadProp, params: any) => {
  const url = makeUploadServiceUrl('svr-api/pf-service/uploadFile');
  let formData = new FormData();
  if (params.file) formData.append('files', params.file);
  else formData = params;
  return request<API.ResponseResult>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params: { ...fuProp },
    data: formData,
  });
};
