/* eslint-disable @typescript-eslint/consistent-type-imports */
import React, { useState, useEffect } from 'react';
import {
    Modal, Form, Input, Button, Select,
    Row, Col, message
} from 'antd';
import { LaptopOutlined } from '@ant-design/icons';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';
import { getUtiAccountByMerchantCode } from '@/services/merchant';
import { showMerchantSelectForm } from '@/pages/globalForm/MerchantSelectForm';

const FormItem = Form.Item;
const Option = Select.Option;
const { Search } = Input;

type SelProp = GLOBAL.FormProps & {
    appMenu: MerAppMenu.MenuItem;
    busiAppList: GLOBAL.StrKeyValue[];
    onOk: (menu: MerAppMenu.MenuItem) => void;
};

const AppMenuPriSelect: React.FC<SelProp> = (props) => {

    const busiAppList: GLOBAL.StrKeyValue[] = props.busiAppList;
    const [appMenu, setAppMenu] = useState<MerAppMenu.MenuItem>(props.appMenu ?? {});
    const [form] = Form.useForm();

    const onOk = async () => {
        closeModal();
        if (props.onOk) {
            const m = { ...appMenu };
            props.onOk(m);
        }
    }

    const onAppSelChanged = (value: string, option: any) => {
        const m = { ...appMenu };
        m.appCode = option.key;
        m.appName = value;
        setAppMenu(m);
    }

    const onSearchMerchant = () => {
        showMerchantSelectForm({
            onSelected: async (selItems: any | any[]) => {
                const selMerchant: MerSetting.MerchantItem = selItems;
                const result = await getUtiAccountByMerchantCode(selMerchant);
                if (result && result.success && result.data) {
                    appMenu.pmCode = selMerchant.pmCode ?? '';
                    appMenu.pmName = selMerchant.pmName ?? '';
                    appMenu.pmShortName = selMerchant.pmShortName ?? '';
                    const m = { ...appMenu };
                    setAppMenu(m);
                    form.setFieldsValue({ pmName: appMenu.pmName });
                    closeModal();
                } else {
                    message.error('商户尚未开通UTI账户');
                }
            },
            selModel: 'single',
        });
    }
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
                key="btnSave"
                onClick={(e) => {
                    e.preventDefault();
                    onOk();
                }}
                style={{ marginLeft: 20 }}
            >
                确认
            </Button>,
        );
        return buttons;
    };

    const title = '菜单设置选择' + ((appMenu.menuType == 1) ? '应用' : '应用及商户');

    return (
        <Modal
            className={styles.modelStyles}
            width={640}
            bodyStyle={{ padding: '15px 15px 15px' }}
            destroyOnClose
            title={title}
            visible={props.modalVisible}
            maskClosable={props.maskClosable ?? false}
            footer={renderBottomButton()}
            onCancel={() => {
                if (props.onCancel != undefined) props.onCancel();
                else closeModal();
            }}
        >
            <Form
                form={form}
                layout="horizontal"
                name="appMenuPriSelect"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
            >
                <Row>
                    <Col span={24}>
                        <FormItem label="选择应用" name="appCode"
                            rules={[{ required: true, message: '请选择应用!' }]}
                            initialValue={appMenu.appCode}
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 21 }}
                        >
                            <Select onSelect={onAppSelChanged}>
                                {busiAppList.map((app: GLOBAL.StrKeyValue) => {
                                    return <Option key={app.key} value={app.value}>
                                        <span>{app.value}</span>
                                    </Option>
                                })}
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                {(appMenu.menuType != 1) &&
                    <Row>
                        <Col span={24}>
                            <FormItem
                                label="商户名称"
                                name="pmName"
                                rules={[{ required: true, message: '请输入商户名称!' }]}
                                initialValue={appMenu.pmName}
                                labelCol={{ span: 3 }}
                                wrapperCol={{ span: 21 }}
                            >
                                <Search readOnly={true} placeholder="输入商户" onSearch={onSearchMerchant} />
                            </FormItem>
                        </Col>
                    </Row>
                }
            </Form>
        </Modal>
    );
}

export default AppMenuPriSelect;

export const showAppMenuPriSelect = (props?: any) => {
    const param = {
        modalVisible: true,
        ...props,
    };
    showModal(AppMenuPriSelect, param);
};