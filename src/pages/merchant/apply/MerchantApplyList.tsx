import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Modal, Tabs } from 'antd';
import styles from '@/components/Global/global.less';
import { applyList } from '@/services/merchant';
import { LibType } from '@/components/Global/data';
import { showApplyModifyForm } from './components/ApplyModifyForm';
import { getValidLibItems } from '@/services/pf-basic';
import { confirmApply, deleteApply } from '@/services/merchant';

const { TabPane } = Tabs;

const MerchantApplyList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selState, setSelState] = useState<number>(0);
  const [busiTypeList, setBusiTypeList] = useState<GLOBAL.StrKeyValue[]>([]);

  const reload = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };
  //加载行业分类
  const loadBusiType = async () => {
    const result = await getValidLibItems({ libTypeCode: LibType.busiType });
    if (result && result.success) {
      setBusiTypeList(result.data);
    }
  };

  useEffect(() => {
    loadBusiType();
  }, []);

  const addApply = () => {
    const applyContentJson = {
      pmBusiType: 'A',
    };
    showApplyModifyForm(false, {
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
      busiTypeList,
    });
  };
  const modifyApplay = (record: MApplay.ApplayProps) => {
    showApplyModifyForm(false, {
      apply: record,
      notifyModifyChanged: (apply: MApplay.ApplayProps) => {
        if (apply) reload();
      },
      busiTypeList,
    });
  };
  const comfireApply = (record: MApplay.ApplayProps) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要确认商户申请信息[' + record.pmName + ']设置吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const result = await confirmApply(record);
        if (result && result.success) {
          reload();
        }
      },
    });
  };
  const delApply = (record: MApplay.ApplayProps) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要删除商户申请信息[' + record.pmName + ']设置吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const result = await deleteApply(record);
        if (result && result.success) {
          reload();
        }
      },
    });
  };
  const applyDetail = (record: MApplay.ApplayProps) => {
    showApplyModifyForm(true, {
      apply: record,
      lsView: true,
      busiTypeList,
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
          key="delApply"
          onClick={() => {
            delApply(record);
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
      width: '250px',
    },
    {
      title: '公司或个人',
      dataIndex: 'pmCompanyPerson',
      align: 'left',
      width: '100px',
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
      width: '100px',
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
      width: '100px',
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
      width: '60px',
      align: 'left',
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      align: 'left',
      width: '110px',
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
      width: '60px',
      align: 'left',
    },
    {
      title: '锁定时间',
      dataIndex: 'lockTime',
      align: 'left',
      width: '110px',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '复核人',
      dataIndex: 'checkerName',
      width: '60px',
      align: 'left',
    },
    {
      title: '复核时间',
      dataIndex: 'checkTime',
      align: 'left',
      width: '110px',
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
      <TabPane tab="编辑" key="0" />
      <TabPane tab="待分配" key="4" />
      <TabPane tab="待审核" key="2" />
      <TabPane tab="已通过" key="1" />
      <TabPane tab="未通过" key="3" />
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
