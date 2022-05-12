import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { message, Tabs, Modal } from 'antd';
import { getValidLibItems } from '@/services/pf-basic';
import { LibType } from '@/components/Global/data';
import styles from '@/components/Global/global.less';
import {
  merchantSettingList,
  queryMerchantDetail,
  setMerchantStart,
  setMerchantPause,
  setMerchantOffLine,
  getUtiAccountByMerchantCode,
} from '@/services/merchant';
import { showMerchantDetailForm } from './components/MerchantDetailForm';
import { showMerchantUtiAccount } from './components/MerchantUtiAccount';
import { closeModal } from '@/components/Global';

const { TabPane } = Tabs;

const MerchantSettingList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selState, setSelState] = useState<number>(1);
  const [buttonClickTime, setButtonClickTime] = useState<Date>(new Date('2000-01-01 00:00:00'));
  const [busiTypeList, setBusiTypeList] = useState<GLOBAL.StrKeyValue[]>([]);

  const reload = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  const onStateSelChanged = (selValue: string) => {
    setSelState(Number(selValue));
    reload();
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

  const queryMerchantList = async (params: any) => {
    const requestParams = { ...params, pmState: selState };
    const result = await merchantSettingList(requestParams);
    if (result && result.success) {
      return result.data;
    }
    return { data: [], total: 0, success: false };
  };

  const showDetailDialog = async (
    record: MerSetting.MerchantItem,
    IsView: boolean,
    onOk:
      | undefined
      | ((merchant: MerSetting.MerchantItem, expand?: MerSetting.MerchantExpand) => void),
  ) => {
    const nDate = new Date();
    if (nDate.getTime() - buttonClickTime.getTime() < 2000) {
      return;
    } else {
      setButtonClickTime(nDate);
    }
    const result = await queryMerchantDetail(record);
    if (result && result.success) {
      const { merchant, merchantExpand } = result.data;
      showMerchantDetailForm({
        busiTypeList,
        merchant,
        merchantExpand,
        IsView: IsView,
        onOk,
      });
    }
  };
  //设置商户信息
  const merchantDetail = (record: MerSetting.MerchantItem) => {
    showDetailDialog(record, true, undefined);
  };
  //设置商户信息
  const merchantSet = (record: MerSetting.MerchantItem) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    showDetailDialog(record, false, (merchant, expand) => {
      message.success('保存商户：' + merchant.pmName + ',操作成功');
      closeModal();
      reload();
    });
  };
  //暂停服务
  const paushService = (record: MerSetting.MerchantItem) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要设置商户[' + record.pmName + ']为暂停服务吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const result = await setMerchantPause(record);
        if (result && result.success) {
          reload();
        }
      },
    });
  };
  //启用服务
  const startService = (record: MerSetting.MerchantItem) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要为商户[' + record.pmName + ']设置可服务吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const result = await setMerchantStart(record);
        if (result && result.success) {
          reload();
        }
      },
    });
  };
  const offLineService = (record: MerSetting.MerchantItem) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要下架商户[' + record.pmName + ']吗?商户下架后不能在本页面继续操作',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const result = await setMerchantOffLine(record);
        if (result && result.success) {
          reload();
        }
      },
    });
  };
  const utiAccount = async (record: MerSetting.MerchantItem) => {
    const nDate = new Date();
    if (nDate.getTime() - buttonClickTime.getTime() < 2000) {
      return;
    } else {
      setButtonClickTime(nDate);
    }
    const result = await getUtiAccountByMerchantCode({ pmCode: record.pmCode });
    if (result) {
      if (result.success && result.data != null) {
        showMerchantUtiAccount({
          pmShortName: record.pmShortName ?? '',
          utiAccount: result.data,
          onOk: (account) => {
            if (account) closeModal();
          },
        });
      } else {
        showMerchantUtiAccount({
          pmShortName: record.pmShortName ?? '',
          utiAccount: { pmCode: record.pmCode },
          onOk: (account) => {
            if (account) closeModal();
          },
        });
      }
    }
  };

  const tabOptions = (
    <Tabs onChange={onStateSelChanged} type="card" activeKey={selState + ''}>
      <TabPane tab="未认证" key="0" />
      <TabPane tab="可服务" key="1" />
      <TabPane tab="已暂停" key="2" />
      <TabPane tab="已下架" key="-1" />
    </Tabs>
  );

  //渲染按钮
  const renderRowButton = (record: MerSetting.MerchantItem) => {
    const buttons = [];
    buttons.push(
      <a
        key="merchantDetail"
        onClick={() => {
          merchantDetail(record);
        }}
      >
        详情
      </a>,
    );
    if (record.pmState == 1) {
      buttons.push(
        <a
          key="paushService"
          onClick={() => {
            paushService(record);
          }}
        >
          暂停
        </a>,
      );
    }
    if (record.pmState == 2) {
      buttons.push(
        <a
          key="merchantSet"
          onClick={() => {
            merchantSet(record);
          }}
        >
          设置
        </a>,
      );
      buttons.push(
        <a
          key="startService"
          onClick={() => {
            startService(record);
          }}
        >
          启用
        </a>,
      );
      buttons.push(
        <a
          key="offLineService"
          onClick={() => {
            offLineService(record);
          }}
        >
          下架
        </a>,
      );
    }
    if (record.pmState == 1 || record.pmState == 2) {
      buttons.push(
        <a
          key="utiAccount"
          onClick={() => {
            utiAccount(record);
          }}
        >
          UTI
        </a>,
      );
    }
    return buttons;
  };

  const columns: ProColumns<MerSetting.MerchantItem>[] = [
    {
      title: '商户代码',
      dataIndex: 'pmCode',
      align: 'left',
      width: '80px',
    },
    {
      title: '商户名称',
      dataIndex: 'pmName',
      align: 'left',
      width: '180px',
    },
    {
      title: '商户简称',
      dataIndex: 'pmShortName',
      align: 'left',
      width: '100px',
    },
    {
      title: '公司或个人',
      dataIndex: 'pmCompanyPerson',
      align: 'left',
      width: '70px',
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
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'left',
      width: '70px',
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
      title: '申请邮箱',
      dataIndex: 'applyEmail',
      width: '160px',
      align: 'left',
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
      <ProTable<MerSetting.MerchantItem, API.PageParams>
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
        request={(params: any) => queryMerchantList(params)}
        columns={columns}
        rowSelection={false}
        pagination={{ pageSize: 10, current: 1 }}
      />
    </PageContainer>
  );
};

export default MerchantSettingList;
