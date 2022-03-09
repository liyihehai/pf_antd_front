import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tree, Input, Row, Col, Button, notification, Space } from 'antd';
const { Search } = Input;
import { AllMenuTree } from '@/services/sys-set';
import SvgIcon from '@/components/SvgIcon';
import { showMenuUpdateForm } from './components/MenuUpdateForm';

const MenuList: React.FC = () => {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        generateList(dList, item.children);
      }
    }
  };

  useEffect(() => {
    AllMenuTree({}).then((result: API.ResponseResult) => {
      const dList: any[] = [];
      generateList(dList, result.data);
      setGData(result.data);
      setDataList(dList);
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
      const itemKey = getItemKey(item);
      const index = itemTile.indexOf(searchValue);
      const beforeStr = itemTile.substr(0, index);
      const afterStr = itemTile.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{itemTile}</span>
        );
      if (item.children) {
        return { title, key: itemKey, children: loop(item.children) };
      }
      return {
        title,
        key: itemKey,
      };
    });

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
  };

  const addTopMenu = () => {
    showMenuUpdateForm();
  };

  const addSubMenu = () => {
    notification.info({
      message: `添加子菜单`,
      description: `添加子菜单`,
    });
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
              <Button type="primary" onClick={() => addSubMenu()}>
                添加子菜单
              </Button>
            </Space>
          </Col>
        </Row>
        <Tree
          showLine={true}
          showIcon={true}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={loop(gData)}
          onSelect={onSelect}
        />
      </div>
    </PageContainer>
  );
};

export default MenuList;
