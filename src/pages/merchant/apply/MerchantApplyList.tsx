import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Modal, Tabs } from 'antd';
import styles from '@/components/Global/global.less';
import { applyList } from '@/services/merchant';
import { showApplyModifyForm } from './components/ApplyModifyForm';

const { TabPane } = Tabs;

const MerchantApplyList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selState, setSelState] = useState<number>(0);

  const reload = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  const addApply = () => {
    const applyContentJson = {
      pmBusiType: 0,
    };
    showApplyModifyForm({
      apply: {
        pmCompanyPerson: 1,
        confirmType: 1,
        applyWays: 1,
        applyState: 0,
        applyContent: JSON.stringify(applyContentJson),
      },
      notifyModifyChanged: (apply: MApplay.ApplayProps) => {
        if (apply) reload();
      },
    });
  };
  const modifyApplay = (record: MApplay.ApplayProps) => {
    showApplyModifyForm({
      apply: record,
      notifyModifyChanged: (apply: MApplay.ApplayProps) => {
        if (apply) reload();
      },
    });
  };
  const comfireApply = (record: MApplay.ApplayProps) => {};
  const deleteApply = (record: MApplay.ApplayProps) => {};
  const applyDetail = (record: MApplay.ApplayProps) => {
    showApplyModifyForm({
      apply: record,
      lsView: true,
    });
  };

  const queryApplyList = async (params: any) => {
    const requestParams = { ...params, applyState: selState };
    const result = await applyList(requestParams);
    if (result.success) {
      return result.data;
    }
    return { data: [], total: 0, success: false };
  };

  //渲染按钮
  const renderRowButton = (record: MApplay.ApplayProps) => {
    const buttons = [];
    if (record.applyState == 0) {
      buttons.push(
        <a
          key="modifyApplay"
          onClick={() => {
            modifyApplay(record);
          }}
        >
          编辑
        </a>,
      );
    }
    if (record.applyState == 0) {
      buttons.push(
        <a
          key="comfireApply"
          onClick={() => {
            comfireApply(record);
          }}
        >
          确认
        </a>,
      );
    }
    if (record.applyState == 0) {
      buttons.push(
        <a
          key="deleteApply"
          onClick={() => {
            deleteApply(record);
          }}
        >
          删除
        </a>,
      );
    }
    if (record.applyState != 0) {
      buttons.push(
        <a
          key="applyDetail"
          onClick={() => {
            applyDetail(record);
          }}
        >
          详情
        </a>,
      );
    }
    return buttons;
  };

  const columns: ProColumns<MApplay.ApplayProps>[] = [
    {
      title: '商户名称',
      dataIndex: 'pmName',
      align: 'left',
      width: 200,
    },
    {
      title: '公司或个人',
      dataIndex: 'pmCompanyPerson',
      align: 'left',
      valueEnum: {
        null: {
          text: '全部',
        },
        1: {
          text: '公司',
        },
        2: {
          text: '个人',
        },
      },
    },
    {
      title: '申请方式',
      dataIndex: 'applyWays',
      align: 'left',
      valueEnum: {
        null: {
          text: '全部',
        },
        1: {
          text: '操作员申请',
        },
        2: {
          text: '网站自助申请',
        },
        3: {
          text: 'APP自助申请',
        },
        4: {
          text: '业务员申请',
        },
      },
    },
    {
      title: '申请状态',
      dataIndex: 'applyState',
      hideInSearch: true,
      valueEnum: {
        null: {
          text: '全部',
        },
        0: {
          text: '申请编辑',
        },
        1: {
          text: '申请通过',
        },
        2: {
          text: '待审核',
        },
        3: {
          text: '申请未通过',
        },
        4: {
          text: '待分配',
        },
      },
    },
    {
      title: '申请人',
      dataIndex: 'creatorName',
      align: 'left',
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      align: 'left',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '申请时间',
      dataIndex: 'createTimeRange',
      valueType: 'dateRange',
      colSize: 2,
      hideInTable: true,
    },
    {
      title: '处理人',
      dataIndex: 'confirmName',
      align: 'left',
    },
    {
      title: '锁定时间',
      dataIndex: 'lockTime',
      align: 'left',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '复核人',
      dataIndex: 'checkerName',
      align: 'left',
    },
    {
      title: '复核时间',
      dataIndex: 'checkTime',
      align: 'left',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 180,
      render: (_, record) => renderRowButton(record),
    },
  ];

  const onStateSelChanged = (selValue: string) => {
    setSelState(Number(selValue));
    reload();
  };

  const tabOptions = (
    <Tabs onChange={onStateSelChanged} type="card" defaultValue={selState + ''}>
      <TabPane tab="编辑" key="0"></TabPane>
      <TabPane tab="待分配" key="4"></TabPane>
      <TabPane tab="待审核" key="2"></TabPane>
      <TabPane tab="已通过" key="1"></TabPane>
      <TabPane tab="未通过" key="3"></TabPane>
    </Tabs>
  );

  return (
    <PageContainer title={false} className={styles.modelStyles}>
      <ProTable<MApplay.ApplayProps, API.PageParams>
        headerTitle={tabOptions}
        bordered
        defaultSize="small"
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1200 }}
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
              addApply();
            }}
          >
            <PlusOutlined /> 新增申请
          </Button>,
        ]}
        request={(params: any) => queryApplyList(params)}
        columns={columns}
        rowSelection={false}
        pagination={{ pageSize: 10, current: 1 }}
      />
    </PageContainer>
  );
};

export default MerchantApplyList;
