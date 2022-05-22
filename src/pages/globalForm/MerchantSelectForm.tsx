/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, message } from 'antd';
import { showModal, closeModal } from '@/components/Global';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import styles from '@/components/Global/global.less';
import { merchantSettingList } from '@/services/merchant';
/**通用商户选择对话框 */
const MerchantSelectForm: React.FC<GlobalForm.SelProps> = (props) => {
    const selModel = props.selModel;
    const [selItemList, setSelItemList] = useState<MerSetting.MerchantItem[]>([]);
    const [selListCodes, setSelListCodes] = useState<string[]>([]);
    const actionRef = useRef<ActionType>();

    const queryList = async (params: any) => {
        const conditions = { ...params, pmState: 1 };
        const result = await merchantSettingList(conditions);
        if (result && result.success) {
            return result.data;
        }
        return [];
    };

    useEffect(() => { }, [props]);

    const onOk = async () => {
        try {
            if (!selItemList || selItemList.length <= 0) {
                message.error('没有选择任何一个商户');
                return;
            }
            if (selModel == 'single' && props.onSelected) {
                props.onSelected(selItemList[0]);
                return;
            }
            if (selModel == 'multiple' && props.onSelected) {
                props.onSelected(selItemList);
                return;
            }
        } catch (errorInfo) { }
    };

    //渲染底部按钮
    const renderBottomButton = () => {
        const buttons = [];
        buttons.push(
            <Button key="btnClose" onClick={() => closeModal()}>
                关闭
            </Button>,
        );
        buttons.push(
            <Button
                type="primary"
                key="btnSelected"
                onClick={(e) => {
                    e.preventDefault();
                    onOk();
                }}
                style={{ marginLeft: 20 }}
            >
                确定
            </Button>,
        );
        return buttons;
    };

    const onSelectListChanged = (rows: MerSetting.MerchantItem[]) => {
        const opeCodes = rows.map((row) => {
            return row.pmCode ?? '';
        });
        setSelListCodes(opeCodes);
        setSelItemList(rows);
    };

    const columns: ProColumns<MerSetting.MerchantItem>[] = [
        {
            title: '商户代码',
            dataIndex: 'pmCode',
            align: 'left',
        },
        {
            title: '商户简称',
            dataIndex: 'pmShortName',
            align: 'left',
        },
        {
            title: '商户名称',
            dataIndex: 'pmName',
            align: 'left',
        },
    ];

    return (
        <Modal
            className={styles.modelStyles}
            width={850}
            bodyStyle={{ padding: '15px 15px 15px' }}
            destroyOnClose
            title={'选择商户'}
            visible={props.modalVisible}
            maskClosable={props.maskClosable ?? false}
            footer={renderBottomButton()}
            onCancel={() => {
                if (props.onCancel != undefined) props.onCancel();
                else closeModal();
            }}
        >
            <ProTable<MerSetting.MerchantItem, API.PageParams>
                headerTitle="商户选择列表"
                bordered
                defaultSize="small"
                actionRef={actionRef}
                rowKey="pmCode"
                search={{
                    labelWidth: 80,
                    span: 6,
                    resetText: '',
                }}
                toolBarRender={false}
                tableAlertRender={false}
                request={(params: any) => queryList(params)}
                columns={columns}
                rowSelection={{
                    alwaysShowAlert: false,
                    type: selModel == 'single' ? 'radio' : 'checkbox',
                    selectedRowKeys: selListCodes,
                    onChange: (_, rows) => {
                        onSelectListChanged(rows);
                    },
                }}
                pagination={{ pageSize: 10, current: 1 }}
            />
        </Modal>
    );
};

export default MerchantSelectForm;

export const showMerchantSelectForm = (props?: GlobalForm.SelProps) => {
    const param = {
        onSelected: (item: MerSetting.MerchantItem | MerSetting.MerchantItem[]) => {
            closeModal();
        },
        modalVisible: true,
        ...props,
    };
    showModal(MerchantSelectForm, param);
};
