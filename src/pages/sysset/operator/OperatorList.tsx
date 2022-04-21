import React, { useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Modal } from 'antd';
import { operatorSetList, deleteOperatorByCode } from '@/services/sys-set';
import { showOpeModifyForm } from './components/OpeModifyForm';
import { showOpePasswordForm } from './components/OpePasswordForm';
import { showOpeRoleSetForm } from './components/OpeRoleSetForm';
import { showOpeFuncSetForm } from './components/OpeFuncSetForm';
import styles from '@/components/Global/global.less';

const OperatorList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const reload = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  const addOperator = () => {
    const operator = {
      opeType: 2,
      opeState: 0,
    };
    showOpeModifyForm({
      operator,
      notifyOperatorChanged: (updateOperator: Ope.OperatorItem) => {
        if (updateOperator) reload();
      },
    });
  };

  const modifyOperator = (record: Ope.OperatorItem) => {
    showOpeModifyForm({
      operator: record,
      notifyOperatorChanged: (updateOperator: Ope.OperatorItem) => {
        if (updateOperator) reload();
      },
    });
  };

  const deleteOperator = (record: Ope.OperatorItem) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要删除操作员[' + record.opeCode + ':' + record.opeName + ']定义吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const result = await deleteOperatorByCode(record);
        if (result && result.success) {
          reload();
        }
      },
    });
  };

  const setOperatorPws = (record: Ope.OperatorItem) => {
    showOpePasswordForm({
      operator: record,
    });
  };

  const setOperatorRole = (record: Ope.OperatorItem) => {
    showOpeRoleSetForm({
      operator: record,
    });
  };

  const setOperatorFunction = (record: Ope.OperatorItem) => {
    showOpeFuncSetForm({
      operator: record,
    });
  };

  const columns: ProColumns<Ope.OperatorItem>[] = [
    {
      title: '操作员代码',
      dataIndex: 'opeCode',
      align: 'left',
    },
    {
      title: '操作员名称',
      dataIndex: 'opeName',
      align: 'left',
    },
    {
      title: '操作员类型', //1超级管理员    2普通操作员 3:自动操作员
      dataIndex: 'opeType',
      align: 'left',
      valueEnum: {
        null: {
          text: '全部',
          status: 'All',
        },
        1: {
          text: '超级管理员',
          status: 'Admin',
        },
        2: {
          text: '普通操作员',
          status: 'Common',
        },
        3: {
          text: '自动操作员',
          status: 'Auto',
        },
      },
    },
    {
      title: '操作员手机',
      dataIndex: 'opeMobile',
      align: 'left',
    },
    {
      title: '操作员状态', //0:未开通，1：有效，2：暂停，3：删除
      dataIndex: 'opeState',
      valueEnum: {
        null: {
          text: '全部',
          status: 'All',
        },
        0: {
          text: '未开通',
          status: 'Error',
        },
        1: {
          text: '有效',
          status: 'Success',
        },
        2: {
          text: '暂停',
          status: 'Pauth',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'left',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTimeRange',
      valueType: 'dateRange',
      colSize: 2,
      hideInTable: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 260,
      render: (_, record) => [
        <a
          key="modifyOperator"
          onClick={() => {
            modifyOperator(record);
          }}
        >
          编辑
        </a>,
        <a
          key="deleteOperator"
          onClick={() => {
            deleteOperator(record);
          }}
        >
          删除
        </a>,
        <a
          key="setOperatorPws"
          onClick={() => {
            setOperatorPws(record);
          }}
        >
          密码
        </a>,
        <a
          key="setOperatorRole"
          onClick={() => {
            setOperatorRole(record);
          }}
        >
          角色
        </a>,
        <a
          key="setOperatorFunction"
          onClick={() => {
            setOperatorFunction(record);
          }}
        >
          功能
        </a>,
      ],
    },
  ];

  const queryOpeList = async (params: any) => {
    const requestParams = { ...params }; /*sysRoleSel: sysRoleValue*/
    const result = await operatorSetList(requestParams);
    if (result.success) {
      return result.data;
    }
    return { data: [], total: 0, success: false };
  };

  return (
    <PageContainer title={false} className={styles.modelStyles}>
      <ProTable<Ope.OperatorItem, API.PageParams>
        headerTitle="操作员设置列表"
        bordered
        defaultSize="small"
        actionRef={actionRef}
        rowKey="opeCode"
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
              addOperator();
            }}
          >
            <PlusOutlined /> 新增操作员
          </Button>,
        ]}
        request={(params: any) => queryOpeList(params)}
        columns={columns}
        rowSelection={false}
        pagination={{ pageSize: 10, current: 1 }}
      />
    </PageContainer>
  );
};

export default OperatorList;
