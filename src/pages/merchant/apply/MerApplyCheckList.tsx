import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal, Tabs } from 'antd';
import styles from '@/components/Global/global.less';
import {
  applyCheckList,
  deleteApply,
  applyDistribute,
  applyReject,
  applyRefuse,
  applyPass,
} from '@/services/merchant';
import { LibType } from '@/components/Global/data';
import { showApplyModifyForm } from './components/ApplyModifyForm';
import { getValidLibItems } from '@/services/pf-basic';
import { showOperatorSelectForm } from '@/pages/globalForm/OperatorSelectForm';
import { showTitleAreaTextForm } from '@/pages/globalForm/TitleAreaTextForm';
import { showApplyCheckPassForm } from './components/ApplyCheckPassForm';
import { closeModal } from '@/components/Global';
const { TabPane } = Tabs;

const MerApplyCheckList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selState, setSelState] = useState<number>(4);
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

  const exportApplyList = () => {};

  const distributeApplay = (record: MApplay.ApplayProps) => {
    showOperatorSelectForm({
      selModel: 'single',
      onSelected: async (operator: Ope.OperatorItem | Ope.OperatorItem[]) => {
        if (operator) {
          const ope = operator as Ope.OperatorItem;
          const param = {
            id: record.id,
            opeCode: ope.opeCode,
          };
          const result = await applyDistribute(param);
          if (result && result.success) {
            message.success(result.errorMessage);
            closeModal();
            reload();
          } else message.error(result.errorMessage);
        }
      },
    });
  };
  const rejectApplay = (record: MApplay.ApplayProps) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要驳回商户申请信息[' + record.pmName + ']吗?驳回后可重新提交。',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const result = await applyReject(record);
        if (result && result.success) {
          reload();
        }
      },
    });
  };
  const doApplyPass = (record: MApplay.ApplayProps) => {
    const param = {
      apply: record,
      onOk: async (values: MApplay.ApplyCheckPassResult) => {
        const submitApply = { ...record };
        submitApply.pmCode = values.pmCode ?? '';
        submitApply.pmShortName = values.pmShortName;
        submitApply.checkDesc = values.checkDesc;
        const result = await applyPass(submitApply);
        if (result) {
          if (result.success) {
            message.success(result.errorMessage);
            closeModal();
            reload();
          }
        }
      },
    };
    showApplyCheckPassForm(param);
  };
  const doApplyRefuse = (record: MApplay.ApplayProps) => {
    showTitleAreaTextForm({
      title: '输入拒绝原因',
      keyValue: record.id,
      keyLabel: '商户名称',
      keyName: record.pmName,
      textLabel: '拒绝原因',
      onConfirm: async (result: GlobalForm.TitleAreaTextResult) => {
        const refuseResult = await applyRefuse({
          id: result.keyValue,
          refuseReason: result.textValue,
        });
        if (refuseResult) {
          if (refuseResult.success) {
            message.success(refuseResult.errorMessage);
            closeModal();
            reload();
          } else message.success(refuseResult.errorMessage);
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
    showApplyModifyForm({
      apply: record,
      lsView: true,
      busiTypeList,
    });
  };

  const queryApplyCheckList = async (params: any) => {
    const requestParams = { ...params, applyState: selState };
    const result = await applyCheckList(requestParams);
    if (result.success) {
      return result.data;
    }
    return { data: [], total: 0, success: false };
  };

  //渲染按钮
  const renderRowButton = (record: MApplay.ApplayProps) => {
    const buttons = [];
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
    if (record.applyState == 4) {
      buttons.push(
        <a
          key="distributeApplay"
          onClick={() => {
            distributeApplay(record);
          }}
        >
          分配
        </a>,
      );
      buttons.push(
        <a
          key="rejectApplay"
          onClick={() => {
            rejectApplay(record);
          }}
        >
          驳回
        </a>,
      );
    }
    if (record.applyState == 2) {
      buttons.push(
        <a
          key="doApplyPass"
          onClick={() => {
            doApplyPass(record);
          }}
        >
          通过
        </a>,
      );
      buttons.push(
        <a
          key="doApplyRefuse"
          onClick={() => {
            doApplyRefuse(record);
          }}
        >
          拒绝
        </a>,
      );
    }
    if (record.applyState == 3) {
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
              exportApplyList();
            }}
          >
            导出
          </Button>,
        ]}
        request={(params: any) => queryApplyCheckList(params)}
        columns={columns}
        rowSelection={false}
        pagination={{ pageSize: 10, current: 1 }}
      />
    </PageContainer>
  );
};

export default MerApplyCheckList;
