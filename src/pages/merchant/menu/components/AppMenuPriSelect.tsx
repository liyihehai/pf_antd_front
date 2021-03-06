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
                    message.error('??????????????????UTI??????');
                }
            },
            selModel: 'single',
        });
    }
    //??????????????????
    const renderBottomButton = () => {
        const buttons = [];
        buttons.push(
            <Button key="btnClose" onClick={() => closeModal()}>
                ??????
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
                ??????
            </Button>,
        );
        return buttons;
    };

    const title = '??????????????????' + ((appMenu.menuType == 1) ? '??????' : '???????????????');

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
                        <FormItem label="????????????" name="appCode"
                            rules={[{ required: true, message: '???????????????!' }]}
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
                                label="????????????"
                                name="pmName"
                                rules={[{ required: true, message: '?????????????????????!' }]}
                                initialValue={appMenu.pmName}
                                labelCol={{ span: 3 }}
                                wrapperCol={{ span: 21 }}
                            >
                                <Search readOnly={true} placeholder="????????????" onSearch={onSearchMerchant} />
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