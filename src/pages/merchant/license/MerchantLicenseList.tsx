import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Modal, Tabs } from 'antd';
import styles from '@/components/Global/global.less';
import { merchantLicenseList } from '@/services/merchant';
import { LibType } from '@/components/Global/data';
import { getValidLibItems, getValidBusiModuleKVList } from '@/services/pf-basic';
import { confirmMerchantLicense, deleteMerchantLicense } from '@/services/merchant';
import { showLicenseModifyForm } from './components/LicenseModifyForm';
import { monthAdd } from '@/components/Global/dateutil';
import { genRandomCode } from '@/components/Global/stringUtil';
import { closeModal } from '@/components/Global';

const { TabPane } = Tabs;

const MerchantLicenseList: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [selState, setSelState] = useState<number>(0);
    const [busiAppList, setBusiAppList] = useState<GLOBAL.StrKeyValue[]>([]);
    const [busiModuleList, setBusiModuleList] = useState<GLOBAL.StrKeyValue[]>([]);

    const reload = () => {
        if (actionRef.current) {
            actionRef.current.reload();
        }
    };
    //加载商业应用
    const loadBusiApp = async () => {
        const result = await getValidLibItems({ libTypeCode: LibType.BusiApp });
        if (result && result.success) {
            setBusiAppList(result.data);
        }
    };
    //加载商业模块
    const loadBusiModule = async () => {
        const result = await getValidBusiModuleKVList({});
        if (result && result.success) {
            setBusiModuleList(result.data);
        }
    };

    useEffect(() => {
        loadBusiApp();
        loadBusiModule();
    }, []);

    const addTestLicense = () => {
        const now = new Date();
        const license: License.AppLicense | any = {
            feeType: 2,
            startDate: now,
            monthCount: 1,
            endDate: monthAdd(now, 1),
            copyCount: 1,
            terminals: 'term:' + genRandomCode(10),
        }
        showLicenseModifyForm(false, {
            license,
            onOk: (save: License.AppLicense) => {
                if (save) {
                    closeModal();
                    reload();
                }
            },
            busiAppList,
            busiModuleList,
        });
    };
    const modifyLicense = (record: License.AppLicense) => {
        showLicenseModifyForm(false, {
            license: record,
            onOk: (save: License.AppLicense) => {
                if (save) {
                    reload();
                    closeModal();
                }
            },
            busiAppList,
            busiModuleList,
        });
    };
    const comfireLicense = (record: License.AppLicense) => {
        Modal.confirm({
            title: '温馨提示',
            content: '确定要确认商户[' + record.pmShortName + ':' + record.appName + ':'
                + record.moduleName + ':' + record.mamNo + ']授权信息吗?',
            cancelText: '取消',
            okText: '确定',
            onOk: async () => {
                const result = await confirmMerchantLicense(record);
                if (result && result.success) {
                    reload();
                }
            },
        });
    };
    const delLicense = (record: License.AppLicense) => {
        Modal.confirm({
            title: '温馨提示',
            content: '确定要删除商户申请信息[' + record.pmShortName + ':' + record.appName
                + ':' + record.moduleName + ':' + record.mamNo + ']设置吗?',
            cancelText: '取消',
            okText: '确定',
            onOk: async () => {
                const result = await deleteMerchantLicense(record);
                if (result && result.success) {
                    reload();
                }
            },
        });
    };
    const licenseDetail = (record: License.AppLicense) => {
        showLicenseModifyForm(false, {
            license: record,
            busiAppList,
            busiModuleList,
            IsView: true,
        });
    };

    const queryList = async (params: any) => {
        const requestParams = { ...params, licenseState: selState };
        const result = await merchantLicenseList(requestParams);
        if (result.success) {
            return result.data;
        }
        return { data: [], total: 0, success: false };
    };

    //渲染按钮
    const renderRowButton = (record: License.AppLicense) => {
        const buttons = [];
        if (record.licenseState == 0) {
            buttons.push(
                <a
                    key="modifyLicense"
                    onClick={() => {
                        modifyLicense(record);
                    }}
                >
                    编辑
                </a>,
            );
        }
        if (record.licenseState == 0) {
            buttons.push(
                <a
                    key="comfireLicense"
                    onClick={() => {
                        comfireLicense(record);
                    }}
                >
                    确认
                </a>,
            );
        }
        if (record.licenseState == 0) {
            buttons.push(
                <a
                    key="delLicense"
                    onClick={() => {
                        delLicense(record);
                    }}
                >
                    删除
                </a>,
            );
        }
        if (record.licenseState != 0) {
            buttons.push(
                <a
                    key="licenseDetail"
                    onClick={() => {
                        licenseDetail(record);
                    }}
                >
                    详情
                </a>,
            );
        }
        return buttons;
    };

    const columns: ProColumns<License.AppLicense>[] = [
        {
            title: '商户简称',
            dataIndex: 'pmShortName',
            align: 'left',
            width: '150px',
        },
        {
            title: '应用名称',
            dataIndex: 'appName',
            align: 'left',
            width: '200px',
        },
        {
            title: '模块名称',
            dataIndex: 'moduleName',
            align: 'left',
            width: '200px',
        },
        {
            title: 'MAM序号',
            dataIndex: 'mamNo',
            width: '100px',
        },
        {
            title: '模块版本',
            dataIndex: 'moduleVersion',
            align: 'left',
        },
        {
            title: '开始日期',
            dataIndex: 'startDate',
            valueType: 'date'
        },
        {
            title: '结束日期',
            dataIndex: 'endDate',
            valueType: 'date'
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

    //:0编辑，1待执行，2执行中，3执行结束，4已终止
    const tabOptions = (
        <Tabs onChange={onStateSelChanged} type="card" defaultValue={selState + ''}>
            <TabPane tab="编辑" key="0" />
            <TabPane tab="待执行" key="1" />
            <TabPane tab="执行中" key="2" />
            <TabPane tab="执行结束" key="3" />
            <TabPane tab="已终止" key="4" />
        </Tabs>
    );

    return (
        <PageContainer title={false} className={styles.modelStyles}>
            <ProTable<License.AppLicense, API.PageParams>
                headerTitle={tabOptions}
                bordered
                defaultSize="small"
                actionRef={actionRef}
                rowKey="id"
                scroll={{ x: 1500 }}
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
                            addTestLicense();
                        }}
                    >
                        <PlusOutlined /> 新增试用许可
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

export default MerchantLicenseList;
