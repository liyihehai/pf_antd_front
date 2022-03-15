/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Tree, Input, Row, Col, Button, Space } from 'antd';
const { Search } = Input;
import { roleSetList } from '@/services/sys-set';
import SysRoleSelect from './components/SysRoleSelect';
import SvgIcon from '@/components/SvgIcon';

const RoleList: React.FC = () => {
  const [sysRoleList, setSysRoleList] = useState<any[]>([]);
  const [sysRoleValue, setSysRoleValue] = useState<string>('');
  useEffect(() => {}, []);
  const actionRef = useRef<ActionType>();

  const modifyRole = (record: Role.RoleListItem) => {};

  const deleteRole = (record: Role.RoleListItem) => {};

  const setRoleFunction = (record: Role.RoleListItem) => {};

  const setSelectedRows = (selectedRows: Role.RoleListItem[]) => {};

  const addRole = () => {};

  const onSysRoleSelectChanged = (value: string) => {
    setSysRoleValue(value);
  };

  const columns: ProColumns<Role.RoleListItem>[] = [
    {
      title: '角色代码',
      dataIndex: 'roleCode',
      align: 'left',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      align: 'left',
    },
    {
      title: '系统角色名',
      dataIndex: 'sysroleNameList',
      valueType: 'textarea',
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return (
          <SysRoleSelect
            {...rest}
            allOption={{ label: '全部', value: '' }}
            sysRoleList={sysRoleList}
            value={sysRoleValue}
            onChange={onSysRoleSelectChanged}
          />
        );
      },
    },
    {
      title: '角色状态',
      dataIndex: 'roleState',
      valueEnum: {
        null: {
          text: '全部',
          status: 'All',
        },
        0: {
          text: '无效',
          status: 'Error',
        },
        1: {
          text: '有效',
          status: 'Success',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="modifyRole"
          onClick={() => {
            modifyRole(record);
          }}
        >
          编辑
        </a>,
        <a
          key="deleteRole"
          onClick={() => {
            deleteRole(record);
          }}
        >
          删除
        </a>,
        <a
          key="setRoleFunction"
          onClick={() => {
            setRoleFunction(record);
          }}
        >
          功能
        </a>,
      ],
    },
  ];

  const queryRoleList = async (params: any) => {
    const requestParams = { ...params, sysRoleSel: sysRoleValue };
    const result = await roleSetList(requestParams);
    if (result.success) {
      setSysRoleList(result.data.sysRoleList);
      return result.data.roleList;
    }
    return { data: [], total: 0, success: false };
  };

  return (
    <PageContainer title={false}>
      <ProTable<Role.RoleListItem, API.PageParams>
        headerTitle="角色设置列表"
        defaultSize="small"
        actionRef={actionRef}
        rowKey="roleCode"
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
              addRole();
            }}
          >
            <PlusOutlined /> 新增角色
          </Button>,
        ]}
        request={(params) => queryRoleList(params)}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        pagination={{ pageSize: 10, current: 1 }}
      />
    </PageContainer>
  );
};

export default RoleList;
