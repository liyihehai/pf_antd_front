import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Modal, Space, Button, message } from 'antd';
import styles from '@/components/Global/global.less';
import { getLibraryItemList, delLibraryItem } from '@/services/pf-basic';
import SearchSelect from '@/components/Global/SearchSelect';
import { showLibItemModifyForm } from './component/LibItemModifyForm';
import { PlusOutlined } from '@ant-design/icons';

const Library: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [libTypeList, setLibTypeList] = useState<any[]>([]);
  const [libTypeCode, setLibTypeCode] = useState<string>('');
  const [libTypeName, setLibTypeName] = useState<string>('');

  const reload = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  const addLibItem = () => {
    if (!libTypeCode) {
      message.error('请先选择数据字典类型');
      return;
    }
    const libItem: Libr.LibItem = {
      id: 0,
      libTypeCode,
      libTypeName,
      typeItemCode: '',
      typeItemName: '',
      itemState: 0,
      itemSort: 0,
      canModify: 1,
    };
    showLibItemModifyForm({
      libItem,
      notifyModifyChanged: (updateLibItem: Libr.LibItem) => {
        if (updateLibItem) reload();
      },
    });
  };
  const modifyLibItem = (record: Libr.LibItem) => {
    showLibItemModifyForm({
      libItem: record,
      notifyModifyChanged: (item: Libr.LibItem) => {
        if (item) reload();
      },
    });
  };

  const detailLibItem = (record: Libr.LibItem) => {
    showLibItemModifyForm({
      libItem: record,
      lsView: true,
    });
  };

  const delLibItem = (record: Libr.LibItem) => {
    Modal.confirm({
      title: '温馨提示',
      content:
        '确定要删除数据字典分项[' + record.typeItemCode + ':' + record.typeItemName + ']定义吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const result = await delLibraryItem(record);
        if (result && result.success) {
          reload();
        }
      },
    });
  };

  const renderOperates = (record: Libr.LibItem) => {
    switch (record.canModify ?? 0) {
      case 1:
        return (
          <span>
            <Space>
              <a onClick={() => modifyLibItem(record)}>编辑</a>
              <a onClick={() => delLibItem(record)}>删除</a>
            </Space>
          </span>
        );
        break;
    }
    return <a onClick={() => detailLibItem(record)}>详情</a>;
  };

  const onLibTypeChanged = (value: string, option: any) => {
    setLibTypeCode(value);
    setLibTypeName(option.label);
  };

  const columns: ProColumns<Libr.LibItem>[] = [
    {
      title: '数据分类',
      dataIndex: 'libTypeCode',
      hideInTable: true,
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return (
          <SearchSelect
            {...rest}
            allOption={{ label: '-请选择-', value: '' }}
            selectList={libTypeList}
            value={libTypeCode}
            onChange={onLibTypeChanged}
          />
        );
      },
    },
    {
      title: '分项编号',
      dataIndex: 'typeItemCode',
      width: 75,
    },
    {
      title: '分项名称',
      dataIndex: 'typeItemName',
      width: 300,
    },
    {
      title: '排序',
      dataIndex: 'itemSort',
      width: 75,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true,
    },
    {
      title: '可维护标志',
      dataIndex: 'canModify',
      width: 150,
      valueEnum: {
        null: {
          text: '全部',
        },
        0: {
          text: '否',
        },
        1: {
          text: '是',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 150,
      render: (_, record: Libr.LibItem) => renderOperates(record),
    },
  ];

  const queryList = async (params: any) => {
    const requestParams = { ...params, libTypeCode };
    const result = await getLibraryItemList(requestParams);
    if (result.success) {
      setLibTypeList(result.data.libTypeList);
      return result.data.libItemList;
    }
    return { data: [], total: 0, success: false };
  };

  return (
    <PageContainer title={false} className={styles.modelStyles}>
      <ProTable<Libr.LibItem, API.PageParams>
        headerTitle="数据字典"
        bordered
        defaultSize="small"
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1000 }}
        search={{
          labelWidth: 100,
          span: 6,
          resetText: '',
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              addLibItem();
            }}
          >
            <PlusOutlined /> 新增分项
          </Button>,
        ]}
        request={(params: any) => queryList(params)}
        columns={columns}
        rowSelection={false}
        pagination={{ pageSize: 10, current: 1 }}
      />
    </PageContainer>
  );
};

export default Library;
