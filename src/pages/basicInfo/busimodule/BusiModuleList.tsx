import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getBusinessModuleList, setBusinessModuleStatus } from '@/services/pf-basic';
import styles from '@/components/Global/global.less';
import { closeModal } from '@/components/Global';
import { showBusiModuleModify } from './component/BusiModuleMidify';

const BusiModuleList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const reload = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  const queryBusiModuleList = async (params: any) => {
    const requestParams = { ...params };
    const result = await getBusinessModuleList(requestParams);
    if (result && result.success) {
      return result.data;
    }

    return { data: [], total: 0, success: false };
  };

  const onModuleChanged = (m: BusiModule.ModuleItem) => {
    if (m && m.id && m.id > 0) {
      closeModal();
      reload();
    }
  };
  const addModule = () => {
    showBusiModuleModify(false, {
      module: { id: 0, moduleStatus: 0 },
      onOk: (m: BusiModule.ModuleItem) => {
        onModuleChanged(m);
      },
    });
  };
  const modify = (record: BusiModule.ModuleItem) => {
    showBusiModuleModify(false, {
      module: record,
      onOk: (m: BusiModule.ModuleItem) => {
        onModuleChanged(m);
      },
    });
  };
  const detail = (record: BusiModule.ModuleItem) => {
    showBusiModuleModify(true, {
      module: record,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onOk: (m: BusiModule.ModuleItem) => {},
    });
  };
  const readyOffLine = (record: BusiModule.ModuleItem) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要设置模块[' + record.moduleCode + ':' + record.moduleName + ']状态为将作废吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const obj = { ...record };
        obj.moduleStatus = 2;
        const result = await setBusinessModuleStatus(obj);
        if (result && result.success) {
          reload();
        }
      },
    });
  };
  const normalService = (record: BusiModule.ModuleItem) => {
    Modal.confirm({
      title: '温馨提示',
      content:
        '确定要设置模块[' +
        record.moduleCode +
        ':' +
        record.moduleName +
        ']状态为已上线吗?设置后模块状态将不能更改!',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const obj = { ...record };
        obj.moduleStatus = 1;
        const result = await setBusinessModuleStatus(obj);
        if (result && result.success) {
          reload();
        }
      },
    });
  };
  const offLine = (record: BusiModule.ModuleItem) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要设置模块[' + record.moduleCode + ':' + record.moduleName + ']状态为已作废吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const obj = { ...record };
        obj.moduleStatus = -1;
        const result = await setBusinessModuleStatus(obj);
        if (result && result.success) {
          reload();
        }
      },
    });
  };

  //渲染按钮
  const renderRowButton = (record: BusiModule.ModuleItem) => {
    const buttons = [];
    if (record.moduleStatus == 0) {
      buttons.push(
        <a
          key="modify"
          onClick={() => {
            modify(record);
          }}
        >
          编辑
        </a>,
      );
    }
    if (record.moduleStatus != 0) {
      buttons.push(
        <a
          key="detail"
          onClick={() => {
            detail(record);
          }}
        >
          详情
        </a>,
      );
    }
    if (record.moduleStatus == 1) {
      buttons.push(
        <a
          key="readyOffLine"
          onClick={() => {
            readyOffLine(record);
          }}
        >
          即将作废
        </a>,
      );
    }
    if (record.moduleStatus == 0 || record.moduleStatus == 2) {
      buttons.push(
        <a
          key="normalService"
          onClick={() => {
            normalService(record);
          }}
        >
          正常服务
        </a>,
      );
    }
    if (record.moduleStatus == 0 || record.moduleStatus == 2) {
      buttons.push(
        <a
          key="offLine"
          onClick={() => {
            offLine(record);
          }}
        >
          作废
        </a>,
      );
    }
    return buttons;
  };

  const columns: ProColumns<BusiModule.ModuleItem>[] = [
    {
      title: '模块代码',
      dataIndex: 'moduleCode',
      align: 'left',
      width: '140px',
    },
    {
      title: '模块名称',
      dataIndex: 'moduleName',
      align: 'left',
      width: '100px',
    },
    {
      title: '模块说明',
      dataIndex: 'moduleDesc',
      align: 'left',
      width: '200px',
    },
    {
      title: '最新版本',
      dataIndex: 'currentVersion',
      align: 'left',
      width: '100px',
    },
    {
      title: '模块状态',
      dataIndex: 'moduleStatus',
      align: 'left',
      width: '70px',
      valueEnum: {
        '0': {
          text: '未上线',
        },
        '1': {
          text: '已上线',
        },
        '2': {
          text: '将作废',
        },
        '-1': {
          text: '已作废',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      align: 'left',
      width: '70px',
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

  return (
    <PageContainer title={false} className={styles.modelStyles}>
      <ProTable<BusiModule.ModuleItem, API.PageParams>
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
              addModule();
            }}
          >
            <PlusOutlined /> 新增模块
          </Button>,
        ]}
        request={(params: any) => queryBusiModuleList(params)}
        columns={columns}
        rowSelection={false}
        pagination={{ pageSize: 10, current: 1 }}
      />
    </PageContainer>
  );
};

export default BusiModuleList;
