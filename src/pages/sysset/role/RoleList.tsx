/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Modal } from 'antd';
import { roleSetList, deleteRoleByCode } from '@/services/sys-set';
import SysRoleSelect from './components/SysRoleSelect';
import { showRoleModifyForm } from './components/RoleModifyForm';
import { showRoleFuncForm } from './components/RoleFuncForm';

let setFunctionButtonClickTime: Date = new Date('2000-01-01 00:00:00');

const RoleList: React.FC = () => {
  const [sysRoleList, setSysRoleList] = useState<any[]>([]);
  const [sysRoleValue, setSysRoleValue] = useState<string>('');
  const [functionList, setFunctionList] = useState<Func.FuncProps[]>([]);
  useEffect(() => {}, []);
  const actionRef = useRef<ActionType>();

  const reload = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  const modifyRole = (record: Role.RoleListItem) => {
    showRoleModifyForm({
      sysRoleList,
      role: record,
      notifyRoleChanged: (updateRole: Role.RoleListItem) => {
        if (updateRole) reload();
      },
    });
  };

  const deleteRole = (record: Role.RoleListItem) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要删除角色[' + record.roleCode + ':' + record.roleName + ']定义吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const result = await deleteRoleByCode(record);
        if (result && result.success) {
          reload();
        }
      },
    });
  };

  const setRoleFunction = (record: Role.RoleListItem) => {
    showRoleFuncForm({
      functionList,
      role: record,
      notifyRoleChanged: (updateRole: Role.RoleListItem) => {
        if (updateRole) reload();
      },
    });
  };

  const addRole = () => {
    const role = {};
    showRoleModifyForm({
      sysRoleList,
      role,
      notifyRoleChanged: (updateRole: Role.RoleListItem) => {
        if (updateRole) reload();
      },
    });
  };

  const onSysRoleSelectChanged = (value: string) => {
    setSysRoleValue(value);
  };

  const onSetRoleFuncClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, record: any) => {
    const nDate = new Date();
    if (nDate.getTime() - setFunctionButtonClickTime.getTime() < 2000) {
      return;
    } else {
      setFunctionButtonClickTime = nDate;
      setRoleFunction(record);
    }
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
          onClick={(e) => {
            onSetRoleFuncClick(e, record);
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
      setFunctionList(result.data.functionList);
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
        rowSelection={false}
        pagination={{ pageSize: 10, current: 1 }}
      />
    </PageContainer>
  );
};

export default RoleList;
