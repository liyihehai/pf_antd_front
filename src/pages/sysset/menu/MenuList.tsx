/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tree, Input, Row, Col, Button, Space } from 'antd';
const { Search } = Input;
import { AllMenuTree, getFEnter } from '@/services/sys-set';
import SvgIcon from '@/components/SvgIcon';
import type { MenuProps } from './components/MenuUpdateForm';
import { showMenuUpdateForm } from './components/MenuUpdateForm';
import { FolderOutlined, FileOutlined } from '@ant-design/icons';
import MenuInfoForm from './components/MenuInfoForm';
import { showFuncUpdateForm } from './components/FuncUpdateForm';
import FuncInfoForm from './components/FuncInfoForm';

const MenuList: React.FC = () => {
  const [currentMenu, setCurrentMenu] = useState<any>({});
  const [currentFunc, setCurrentFunc] = useState<any>({});
  const [selectType, setSelectType] = useState<number>(0);
  const [fEnterList, setFEnterList] = useState<any[]>([]);
  const [gData, setGData] = useState<any[]>([]);
  const [dataList, setDataList] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const getItemKey = (item: any) => {
    return item.funCode ? item.menuCode + '-' + item.funCode : item.menuCode;
  };

  const generateList = (dList: any[], data: any[]) => {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const itemTile = item.funName ?? item.menuName;
      const itemKey = getItemKey(item);
      dList.push({ key: itemKey, title: itemTile });
      if (item.children) {
        generateList(dList, item.children);
      }
    }
  };

  const getMenu = (mCode: string, tree: any): any => {
    for (let i = 0; i < tree.length; i++) {
      const menu = tree[i];
      if (menu.menuCode === mCode) {
        return menu;
      } else {
        if (menu.children && menu.children.length > 0) {
          const subMenu = getMenu(mCode, menu.children);
          if (subMenu) {
            return subMenu;
          }
        }
      }
    }
    return undefined;
  };

  const getFunc = (fCode: string, tree: any): any => {
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.funCode === fCode) {
        return node;
      } else {
        if (node.children && node.children.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const subNode = getFunc(fCode, node.children);
          if (subNode) {
            return subNode;
          }
        }
      }
    }
    return undefined;
  };

  const reloadMenus = (node?: MenuProps | Func.FuncProps | undefined) => {
    AllMenuTree({}).then((result: API.ResponseResult) => {
      if (result) {
        const dList: any[] = [];
        generateList(dList, result.data);
        setGData(result.data);
        setDataList(dList);

        if (node) {
          if ((node as Func.FuncProps).funCode) {
            const reloadFunc = getFunc((node as Func.FuncProps).funCode, result.data) ?? {};
            setCurrentFunc(reloadFunc);
            setSelectType(2);
          } else {
            const reloadMenu = getMenu(node.menuCode, result.data) ?? {};
            setCurrentMenu(reloadMenu);
            setSelectType(1);
          }
        } else {
          setSelectType(0);
          setCurrentFunc({});
          setCurrentMenu({});
        }
      }
    });
  };

  useEffect(() => {
    reloadMenus();
    getFEnter({}).then((result: API.ResponseResult) => {
      if (result) {
        setFEnterList(result.data);
      }
    });
  }, []);

  const onExpand = (expanded_keys: any[]) => {
    setExpandedKeys(expanded_keys);
    setAutoExpandParent(false);
  };

  const getParentKey = (key: any, tree: any): any => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item: any) => getItemKey(item) === key)) {
          parentKey = getItemKey(node);
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const onChange = (e: any) => {
    const { value } = e.target;
    const expanded_Keys = dataList
      .map((item: any) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, gData);
        }
        return null;
      })
      .filter((item: any, i: any, self: any) => item && self.indexOf(item) === i);
    setExpandedKeys(expanded_Keys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const loop = (data: any) =>
    data.map((item: any) => {
      const itemTile = item.funName ?? item.menuName;
      const itemCode = item.funCode ?? item.menuCode;
      const icon = item.funCode ? <FileOutlined /> : <FolderOutlined />;
      const alertStyle = item.menuState == 1 || item.funState == 1 ? undefined : { color: 'red' };
      const itemKey = getItemKey(item);
      const index = itemTile.indexOf(searchValue);
      const beforeStr = itemTile.substr(0, index);
      const afterStr = itemTile.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{'[' + itemCode + ']' + searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{itemTile}</span>
        );
      if (item.children) {
        return {
          title,
          key: itemKey,
          icon,
          style: alertStyle,
          children: loop(item.children),
        };
      }
      return {
        title,
        key: itemKey,
        icon,
        style: alertStyle,
      };
    });

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    if (selectedKeys && selectedKeys.length == 1) {
      const itemKey = selectedKeys[0];
      if (itemKey.toString().indexOf('-') >= 0) {
        const funcCode = itemKey.toString().split('-')[1];
        //如果当前选中的为功能
        const newCurrent = { ...(getFunc(funcCode, gData) ?? {}) };
        setCurrentFunc(newCurrent);
        setSelectType(2);
      } else {
        //如果当前选中的为菜单
        setSelectType(1);
        const newCurrent = { ...(getMenu(itemKey.toString(), gData) ?? {}) };
        setCurrentMenu(newCurrent);
      }
    } else {
      setSelectType(0);
      setCurrentMenu({});
    }
  };

  const onMenuChanged = (node?: MenuProps | Func.FuncProps) => {
    reloadMenus(node);
  };

  const addTopMenu = () => {
    const param = {
      menu: {
        id: 0,
        menuCode: '',
        menuName: '顶级菜单',
        menuClass: 1,
        parentMenuCode: '',
        menuState: 0,
        menuPath: '',
        menuIcon: '',
      },
      notifyMenuChanged: onMenuChanged,
    };
    showMenuUpdateForm(param);
  };

  const addSubMenu = () => {
    const param = {
      menu: {
        id: 0,
        menuCode: '',
        menuName: '',
        menuClass: Number(currentMenu?.menuClass ?? 0) + 1,
        parentMenuCode: currentMenu?.menuCode ?? '',
        menuState: 0,
        menuPath: currentMenu?.menuPath ?? '',
        menuIcon: '',
      },
      notifyMenuChanged: onMenuChanged,
    };
    showMenuUpdateForm(param);
  };

  const addSubFunc = () => {
    const param = {
      func: {
        id: 0,
        menuCode: currentMenu?.menuCode ?? '',
        funCode: '',
        funName: '',
        authCode: '',
        funParam: '',
        funState: 0,
        funComponent: '',
        funPath: '',
        funIcon: '',
      },
      notifyFuncChanged: onMenuChanged,
      fEnterList,
    };
    showFuncUpdateForm(param);
  };

  return (
    <PageContainer title={false}>
      <div>
        <Row gutter={24}>
          <Col span={12}>
            <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
          </Col>
          <Col span={12}>
            <Space>
              <Button
                type="primary"
                onClick={() => addTopMenu()}
                icon={<SvgIcon type={'icon-jbs-testquanxianshenpi'} />}
              >
                添加顶级菜单
              </Button>
              {selectType == 1 && (
                <Button type="primary" onClick={() => addSubMenu()}>
                  添加子菜单
                </Button>
              )}
              {selectType == 1 && (
                <Button type="primary" onClick={() => addSubFunc()}>
                  添加子功能
                </Button>
              )}
            </Space>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Tree
              showLine={{ showLeafIcon: false }}
              showIcon={true}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              treeData={loop(gData)}
              onSelect={onSelect}
              style={{ height: 'calc(100vh - 250px)', overflowY: 'scroll' }}
            />
          </Col>
          <Col span={12}>
            {selectType == 1 && (
              <MenuInfoForm menu={currentMenu} notifyMenuChanged={onMenuChanged} />
            )}
            {selectType == 2 && (
              <FuncInfoForm
                func={currentFunc}
                notifyFuncChanged={onMenuChanged}
                fEnterList={fEnterList}
              />
            )}
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default MenuList;
