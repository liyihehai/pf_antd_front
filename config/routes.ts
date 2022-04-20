export default [
  {
    path: '/',
    name: '',
    redirect: '/welcome',
  },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: '系统设置',
    icon: 'icon-jbs-testmenu',
    path: '/sysset',
    routes: [
      {
        path: '/sysset',
        redirect: '/sysset/menuList',
      },
      {
        name: '菜单管理',
        path: '/sysset/menuList',
        component: './sysset/menu/MenuList',
      },
      {
        name: '角色管理',
        path: '/sysset/roleSetList',
        component: './sysset/role/RoleList',
      },
      {
        name: '操作员管理',
        icon: 'icon-jbs-testCustomermanagement',
        path: '/sysset/operatorSetList',
        component: './sysset/operator/OperatorList',
      },
    ],
  },
  {
    name: '基础数据',
    path: '/basicInfo',
    routes: [
      {
        path: '/basicInfo',
        redirect: '/basicInfo/library',
      },
      {
        name: '数据字典',
        path: '/basicInfo/library',
        component: './basicInfo/library',
      },
    ],
  },
  {
    name: '商户管理',
    icon: 'icon-jbs-testCustomermanagement',
    path: '/merchant',
    routes: [
      {
        path: '/merchant',
        redirect: '/merchant/applyList',
      },
      {
        name: '商户申请',
        icon: 'icon-jbs-testCustomermanagement',
        path: '/merchant/applyList',
        component: './merchant/apply/MerchantApplyList',
      },
      {
        name: '申请审核',
        icon: 'icon-jbs-testCustomermanagement',
        path: '/merchant/applyCheckList',
        component: './merchant/apply/MerApplyCheckList',
      },
      {
        name: '商户设置',
        icon: 'icon-jbs-testCustomermanagement',
        path: '/merchant/settingList',
        component: './merchant/setting/MerchantSettingList',
      },
    ],
  },
  {
    component: './404',
  },
];
