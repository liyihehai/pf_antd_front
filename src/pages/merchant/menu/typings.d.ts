declare namespace MerAppMenu {
  type MenuItem = {
    id?: number; //主键ID
    appCode: string; //应用代码
    menuType: number; //菜单类型:1全局菜单，2：商户菜单
    pmCode: string; //商户代码:菜单类型为2商户菜单时有效
    menuContent: string; //菜单内容
    menuStatus: number; //模块状态:0编辑，1已确认，-1已作废
    createBy: string; //创建人
    createDate: Date; //创建时间
    updateBy: string; //更改人
    updateDate: Date; //更改时间

    appName: string; //应用名称
    pmName: string; //商户名称
    pmShortName: string; //商户简称
  };

  type AppMenu = {
    menuCode: string;
    menuName: string;
    menuClass: number;
    parentMenuCode: string;
    menuState: number;
    menuPath: string;
    menuIcon: string;
  };

  type AppFunc = {
    menuCode: string;
    funCode: string;
    funName: string;
    authCode?: string;
    funParam?: string;
    funState?: number;
    funComponent?: string;
    funPath?: string;
    funIcon?: string;
  };
}
