declare namespace BusiModule {
  type ModuleItem = {
    id: number; //主键ID
    moduleCode: string; //模块代码
    moduleName: string; //模块名称
    moduleDesc: string; //模块说明
    currentVersion: string; //最新版本
    moduleStatus: number; //模块状态:0未上线，1已上线，2将作废，-1已作废
    createBy: string; //创建人
    createDate: Date; //创建时间
    updateBy: string; //更改人
    updateDate: Date; //更改时间
  };
  type BusiModuleProps = GlobalForm.MVFormProps & {
    module: ModuleItem;
    onOk: (m: ModuleItem) => void;
  };
}
