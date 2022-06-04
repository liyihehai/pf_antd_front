/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Modal, Form, Input, Row, Col, Radio, Select } from 'antd';
import { showModal, closeModal } from '@/components/Global';
import SvgIcon from '@/components/SvgIcon';
import styles from '@/components/Global/global.less';
import { saveFunctionModify } from '@/services/sys-set';
import { sysIcons } from '@/components/Global/data';

const { Option } = Select;
const FormItem = Form.Item;

export type FuncUpdateFormProps = {
    onCancel: (flag?: boolean, formVals?: Func.FuncProps) => void;
    onOk: (values: Func.FuncProps) => Promise<void>;
    modalVisible: boolean;
    func: Func.FuncProps;
    maskClosable?: boolean;
    fEnterList?: any[];
    merchantMenu?: boolean;
};

export const getEnterByPath = (fList: any[], path: string) => {
    for (let i = 0; i < fList.length; i++) {
        const enter = fList[i];
        if (enter.path == path) return enter;
    }
    return undefined;
};

const FuncUpdateForm: React.FC<FuncUpdateFormProps> = (props) => {
    const [func, setFunc] = useState<Func.FuncProps>(props.func || {});
    const [merchantMenu] = useState<boolean>(props.merchantMenu ?? false);
    const fEnterList = props.fEnterList ?? [];

    const onFuncStateChanged = (e: any) => {
        const updateFunc = { ...func };
        updateFunc.funState = e.target.value;
        setFunc(updateFunc);
    };

    const [form] = Form.useForm();
    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const updateFunc = { ...values, id: func.id };
            if (!merchantMenu) {
                const result = await saveFunctionModify(updateFunc);
                if (result.success) props.onOk(updateFunc);
            } else
                props.onOk(updateFunc);
        } catch (errorInfo) { }
    };

    const onFuncPathSelect = (path: any) => {
        const enter = getEnterByPath(fEnterList, path);
        form.setFieldsValue({
            funName: enter.name,
            authCode: enter.roleRuler,
        });
    };

    return (
        <Modal
            className={styles.modelStyles}
            width={640}
            bodyStyle={{ padding: '15px 15px 15px' }}
            destroyOnClose
            title={'功能设置'}
            visible={props.modalVisible}
            maskClosable={props.maskClosable ?? false}
            onOk={(e) => {
                onOk();
            }}
            onCancel={() => {
                if (props.onCancel) props.onCancel();
                else closeModal();
            }}
        >
            <Form form={form} layout="horizontal" name="menuModify">
                <Row>
                    <Col span={12}>
                        <FormItem
                            label="功能代码"
                            name="funCode"
                            rules={[{ required: true, message: '请输入功能代码!' }]}
                            initialValue={func.funCode}
                        >
                            <Input />
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="功能名称"
                            name="funName"
                            rules={[{ required: true, message: '功能名称!' }]}
                            initialValue={func.funName}
                        >
                            <Input />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem
                            label="&nbsp;&nbsp;&nbsp;功能参数"
                            name="funParam"
                            initialValue={func.funParam}
                        >
                            <Input readOnly={true} />
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="菜单代码"
                            name="menuCode"
                            rules={[{ required: true, message: '菜单代码' }]}
                            initialValue={func.menuCode}
                        >
                            <Input readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <FormItem
                            label="功能路径"
                            name="funPath"
                            rules={[{ required: true, message: '功能路径!' }]}
                            initialValue={func.funPath}
                        >
                            <Select style={{ width: '100%' }} onSelect={onFuncPathSelect}>
                                {fEnterList.map((enter) => (
                                    <Option key={'funcPath-' + enter.path} value={enter.path}>
                                        <span>{'[' + enter.name + ']' + enter.path}</span>
                                    </Option>
                                ))}
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem
                            label="功能状态"
                            name="funState"
                            rules={[{ required: true, message: '功能状态!' }]}
                            initialValue={func.funState}
                        >
                            <Radio.Group onChange={onFuncStateChanged} disabled={merchantMenu}>
                                <Radio value={0}>不可用</Radio>
                                <Radio value={1}>可用</Radio>
                            </Radio.Group>
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="功能图标"
                            name="funIcon"
                            rules={[{ required: true, message: '菜单图标!' }]}
                            initialValue={func.funIcon}
                        >
                            <Select style={{ width: '100%' }}>
                                {sysIcons.map((name) => (
                                    <Option key={'funcicon-' + name} value={name}>
                                        <SvgIcon type={name} />
                                    </Option>
                                ))}
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem
                            label="权限代码"
                            name="authCode"
                            rules={[{ required: true, message: '权限代码' }]}
                            initialValue={func.authCode}
                        >
                            <Input readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default FuncUpdateForm;

export const showFuncUpdateForm = (props?: any) => {
    const param = {
        onOk: (func: Func.FuncProps) => {
            if (props.notifyFuncChanged) {
                props.notifyFuncChanged(func);
            }
            closeModal();
        },
        ...props,
    };
    showModal(FuncUpdateForm, param);
};
