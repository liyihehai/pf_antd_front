import { getStorage, user_menu_functions } from '@/components/Global/LocalStoreUtil';

export default function fetchMenuData(params, defaultMenuData) {
  const menus = getStorage(user_menu_functions);
  let data = [];
  if (menus && menus != '') data = JSON.parse(menus); /*[
    {
      name: '首页',
      icon: 'icon-jbs-testCustomermanagement',
      path: '/welcome',
    },
    {
      name: '系统kkk',
      icon: 'icon-jbs-testmenu',
      path: '/sysset',
      children: [
        {
          name: '系统管理',
          icon: 'icon-jbs-testmenu',
          children: [
            {
              name: '菜单设置',
              icon: 'icon-jbs-testmenu',
              path: '/sysset/menuList',
            },
            {
              name: '操作员设置',
              icon: 'icon-jbs-testCustomermanagement',
              path: '/sysset/operatorList',
            },
          ],
        },
      ],
    },
    {
      name: '系统222',
      icon: 'icon-jbs-testmenu',
      path: '/merchant',
      children: [
        {
          name: '商户申请',
          icon: 'icon-jbs-testmenu',
          path: '/merchant/applyList',
        },
        {
          name: '商户设置',
          icon: 'icon-jbs-testCustomermanagement',
          path: '/merchant/settingList',
        },
      ],
    },
  ];*/
  return data;
}
