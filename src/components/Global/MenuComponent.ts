import { getStorage, user_menu_functions } from '@/components/Global/LocalStoreUtil';

export default function fetchMenuData(params, defaultMenuData) {
  const menus = getStorage(user_menu_functions);
  let data = [];
  if (menus && menus != '') data = JSON.parse(menus);
  return data;
}
