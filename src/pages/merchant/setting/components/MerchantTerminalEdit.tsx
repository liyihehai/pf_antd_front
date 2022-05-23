/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Tag } from 'antd';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';

const FormItem = Form.Item;

const MerchantTerminalEdit: React.FC<MerSetting.TerminalEditProp> = (props) => {
    const [terminal] = useState<MerSetting.Terminal>(props.terminal ?? {});
    const [IsView] = useState<boolean>(props.IsView ?? true);
    const [form] = Form.useForm();

    useEffect(() => { }, [props]);

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const t = { ...values };
            if (props.onOk) {
                props.onOk(t);
                closeModal();
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
                key="btnConfirm"
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

    return (
        <Modal
            className={styles.modelStyles}
            width={500}
            bodyStyle={{ padding: '15px 15px 15px' }}
            destroyOnClose
            title={'商户终端设置'}
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
                name="terminalEdit"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
            >
                <FormItem label={<Tag>{'终端号'}</Tag>} name="term" initialValue={terminal.term}>
                    <Input readOnly={IsView} />
                </FormItem>
                <FormItem label={<Tag>{'终端名'}</Tag>} name="name" initialValue={terminal.name}>
                    <Input readOnly={IsView} />
                </FormItem>
                <FormItem label={<Tag>{'IP地址'}</Tag>} name="ip" initialValue={terminal.ip}>
                    <Input readOnly={IsView} />
                </FormItem>
            </Form>
        </Modal>
    );
};

export default MerchantTerminalEdit;

export const showMerchantTerminalEdit = (props?: MerSetting.TerminalEditProp) => {
    const param = {
        onOk: (result: MerSetting.Terminal) => {
            closeModal();
        },
        modalVisible: true,
        ...props,
    };
    showModal(MerchantTerminalEdit, param);
};
