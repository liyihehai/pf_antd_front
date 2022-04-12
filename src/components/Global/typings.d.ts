declare namespace GLOBAL {
  type MenuFunc = {
    name?: string;
    path: string;
    icon?: string;
    routePath?: string;
    children?: MenuFunc[];
  };
  type UploadFileItem = {
    uid: string;
    name: string;
    status: undefined;
    url: string;
    thumbUrl: string;
  };
  type StrKeyValue = {
    key: string;
    value?: string;
  };
}
