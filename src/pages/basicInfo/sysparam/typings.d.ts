declare namespace SysParm {
  type AppFuncFilePath = {
    appCode: string; //应用代码
    funcCode: string; //功能代码
    path: string; //绝对路径
    pathMask: string; //路径掩码,返回路径时从绝对路径中截断路径掩码返回
  };
  type AppFuncFactory = {
    appCode?: string;
    appName?: string;
    funcPathMap?: AppFuncFilePath[];
  };
}
