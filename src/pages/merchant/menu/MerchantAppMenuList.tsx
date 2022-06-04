import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Modal, Tabs } from 'antd';
import styles from '@/components/Global/global.less';
import { merchantAppMenuList } from '@/services/merchant';
import { LibType } from '@/components/Global/data';
import { getValidLibItems } from '@/services/pf-basic';
import {
    confirmMerchantAppMenu, merchantAppEnterList,
    cancelMerchantAppMenu, deleteMerchantAppMenu
} from '@/services/merchant';
import { closeModal } from '@/components/Global';
import { showMerchantAppMenuForm } from './components/MerchantAppMenuForm';
import { showAppMenuPriSelect } from './components/AppMenuPriSelect';

const { TabPane } = Tabs;

let setFunctionButtonClickTime: Date = new Date('2000-01-01 00:00:00');

const MerchantAppMenuList: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [selType, setSelType] = useState<number>(1);
    const [busiAppList, setBusiAppList] = useState<GLOBAL.StrKeyValue[]>([]);

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


    useEffect(() => {
        loadBusiApp();
    }, []);

    const addMerchantAppMenu = () => {
        showAppMenuPriSelect({
            appMenu: { menuType: selType },
            busiAppList,
            onOk: async (menu: MerAppMenu.MenuItem) => {
                if (menu && menu.appCode && (menu.menuType == 1 || menu.pmCode)) {
                    const result = await merchantAppEnterList(menu);
                    if (result) {
                        showMerchantAppMenuForm(false, {
                            appMenu: menu,
                            fEnterList: result.data,
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            onOk: (saveMenu: MerAppMenu.MenuItem) => {
                                closeModal();
                                reload();
                            }
                        });
                    }
                }
            }
        });
    };
    const modifyMerchantAppMenu = async (record: MerAppMenu.MenuItem) => {
        const result = await merchantAppEnterList(record);
        if (result) {
            showMerchantAppMenuForm(false, {
                appMenu: record,
                fEnterList: result.data,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onOk: (saveMenu: MerAppMenu.MenuItem) => {
                    closeModal();
                    reload();
                }
            });
        }
    };
    const doComfireMerchantAppMenu = (record: MerAppMenu.MenuItem) => {
        Modal.confirm({
            title: '温馨提示',
            content: '确定要确认商户应用菜单[' + record.appName + ']设置信息吗?',
            cancelText: '取消',
            okText: '确定',
            onOk: async () => {
                const result = await confirmMerchantAppMenu(record);
                if (result && result.success) {
                    reload();
                }
            },
        });
    };
    const doCancelMerchantAppMenu = (record: MerAppMenu.MenuItem) => {
        Modal.confirm({
            title: '温馨提示',
            content: '确定要取消确认商户应用菜单[' + record.appName + ']设置信息吗?',
            cancelText: '取消',
            okText: '确定',
            onOk: async () => {
                const result = await cancelMerchantAppMenu(record);
                if (result && result.success) {
                    reload();
                }
            },
        });
    }
    const delMerchantAppMenu = (record: MerAppMenu.MenuItem) => {
        Modal.confirm({
            title: '温馨提示',
            content: '确定要删除商户应用菜单[' + record.appName + ']设置吗?',
            cancelText: '取消',
            okText: '确定',
            onOk: async () => {
                const result = await deleteMerchantAppMenu(record);
                if (result && result.success) {
                    reload();
                }
            },
        });
    };

    const merchantAppMenuDetail = async (record: MerAppMenu.MenuItem) => {
        const result = await merchantAppEnterList(record);
        if (result) {
            showMerchantAppMenuForm(true, {
                appMenu: record,
                fEnterList: result.data,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onOk: (saveMenu: MerAppMenu.MenuItem) => {
                    closeModal();
                    reload();
                },
            });
        }
    };

    const process_ForbidDC = async (record: MerAppMenu.MenuItem, process: (rec: MerAppMenu.MenuItem) => void) => {
        const nDate = new Date();
        if (nDate.getTime() - setFunctionButtonClickTime.getTime() < 2000) {
            return;
        } else {
            setFunctionButtonClickTime = nDate;
            if (process)
                process(record);
        }
    }

    const queryList = async (params: any) => {
        const requestParams = { ...params, menuType: selType };
        const result = await merchantAppMenuList(requestParams);
        if (result.success) {
            return result.data;
        }
        return { data: [], total: 0, success: false };
    };

    //渲染按钮
    const renderRowButton = (record: MerAppMenu.MenuItem) => {
        const buttons = [];
        if (record.menuStatus == 0) {
            buttons.push(
                <a
                    key="modifyMerchantAppMenu"
                    onClick={() => {
                        process_ForbidDC(record, modifyMerchantAppMenu);
                    }}
                >
                    编辑
                </a>,
            );
        }
        if (record.menuStatus == 0) {
            buttons.push(
                <a
                    key="comfireMerchantAppMenu"
                    onClick={() => {
                        doComfireMerchantAppMenu(record);
                    }}
                >
                    确认
                </a>,
            );
        }
        if (record.menuStatus == 0) {
            buttons.push(
                <a
                    key="delMerchantAppMenu"
                    onClick={() => {
                        delMerchantAppMenu(record);
                    }}
                >
                    删除
                </a>,
            );
        }
        if (record.menuStatus != 0) {
            buttons.push(
                <a
                    key="merchantAppMenuDetail"
                    onClick={() => {
                        process_ForbidDC(record, merchantAppMenuDetail);
                    }}
                >
                    详情
                </a>,
            );
        }
        if (record.menuStatus == 1) {
            buttons.push(
                <a
                    key="cancelMerchantAppMenu"
                    onClick={() => {
                        doCancelMerchantAppMenu(record);
                    }}
                >
                    取消
                </a>,
            );
        }
        return buttons;
    };

    const columns: ProColumns<MerAppMenu.MenuItem>[] = [
        {
            title: '应用代码',
            dataIndex: 'appCode',
            align: 'left',
            width: '150px',
        },
        {
            title: '应用名称',
            dataIndex: 'appName',
            align: 'left',
            width: '250px',
        },
        {
            title: '商户简称',
            dataIndex: 'pmShortName',
            align: 'left',
            width: '150px',
        },
        {
            title: '菜单状态',
            dataIndex: 'menuStatus',
            width: '150px',
            valueEnum: {
                0: {
                    text: '编辑',
                },
                1: {
                    text: '已确认',
                },
            },
        },
        {
            title: '创建时间',
            dataIndex: 'createDate',
            valueType: 'dateTime',
            width: '200px',
            hideInSearch: true,
        },
        {
            title: '创建时间',
            dataIndex: 'createDateRange',
            valueType: 'dateRange',
            colSize: 2,
            hideInTable: true,
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
        setSelType(Number(selValue));
        reload();
    };

    //:0编辑，1待执行，2执行中，3执行结束，4已终止
    const tabOptions = (
        <Tabs onChange={onStateSelChanged} type="card" defaultValue={selType + ''}>
            <TabPane tab="全局菜单" key="1" />
            <TabPane tab="商户菜单" key="2" />
        </Tabs>
    );

    return (
        <PageContainer title={false} className={styles.modelStyles}>
            <ProTable<MerAppMenu.MenuItem, API.PageParams>
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
                            addMerchantAppMenu();
                        }}
                    >
                        <PlusOutlined /> {'新增' + ((selType == 1) ? '全局' : '商户') + '菜单'}
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

export default MerchantAppMenuList;
