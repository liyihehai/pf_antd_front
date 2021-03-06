import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  //navTheme: 'realDark',
  //navTheme: getNavTheme(),
  // 拂晓蓝
  primaryColor: '#1890ff',
  splitMenus: true,
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: false,
  colorWeak: false,
  headerHeight: 48,

  title: 'NNTE平台管理',
  pwa: false,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '//at.alicdn.com/t/font_3181152_8i2rv7vjkio.js',
};

export default Settings;
