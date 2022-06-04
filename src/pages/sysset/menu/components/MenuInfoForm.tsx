/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { Modal, Form, Input, Radio, Select, Button, Space, Row, Col } from 'antd';
import SvgIcon from '@/components/SvgIcon';
import styles from '@/components/Global/global.less';
import { saveMenuModify, deleteMenu } from '@/services/sys-set';
import { sysIcons } from '@/components/Global/data';
const { Option } = Select;
const FormItem = Form.Item;

const MenuInfoForm: React.FC<any> = (props) => {
    const menu = props.menu ?? {};
    const merchantMenu = props.merchantMenu ?? false;
    const [form] = Form.useForm();
    const IsView = props.IsView ?? false;

    useEffect(() => {
        form.setFieldsValue({
            menuCode: menu.menuCode,
            menuName: menu.menuName,
            menuClass: menu.menuClass,
            parentMenuCode: menu.parentMenuCode,
            menuPath: menu.menuPath,
            menuState: Number(menu.menuState),
            menuIcon: menu.menuIcon,
        });
    });

    const modifyMenu = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (merchantMenu == false) {
            Modal.confirm({
                title: '温馨提示',
                content: '确定要更改菜单定义吗?',
                cancelText: '取消',
                okText: '确定',
                onOk: async () => {
                    try {
                        const values = await form.validateFields();
                        const updateMenu = { ...values, id: menu.id };
                        const result = await saveMenuModify(updateMenu);
                        if (result && result.success && props.notifyMenuChanged) {
                            props.notifyMenuChanged(menu);
                        }
                    } catch (errorInfo) { }
                },
            });
        } else {
            Modal.confirm({
                title: '温馨提示',
                content: '确定要更改菜单定义吗?该更改提交后生效',
                cancelText: '取消',
                okText: '确定',
                onOk: async () => {
                    try {
                        const values = await form.validateFields();
                        const retMenu = { ...menu, ...values };
                        if (props.onMenuChanged)
                            props.onMenuChanged(retMenu);
                    } catch (errorInfo) { }
                },
            });
        }
    };
    const doDeleteMenu = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (merchantMenu == false) {
            Modal.confirm({
                title: '温馨提示',
                content: '确定要删除菜单[' + menu.menuCode + ':' + menu.menuName + ']定义吗?',
                cancelText: '取消',
                okText: '确定',
                onOk: async () => {
                    const result = await deleteMenu(menu);
                    if (result && result.success && props.notifyMenuChanged) {
                        props.notifyMenuChanged();
                    }
                },
            });
        } else {
            Modal.confirm({
                title: '温馨提示',
                content: '确定要删除菜单[' + menu.menuCode + ':' + menu.menuName + ']定义吗?该更改提交后生效',
                cancelText: '取消',
                okText: '确定',
                onOk: async () => {
                    const values = await form.validateFields();
                    const retMenu = { ...menu, ...values };
                    if (props.onDeleteMenu)
                        props.onDeleteMenu(retMenu);
                },
            });
        }
    };

    return (
        <Form form={form} className={styles.modelStyles}>
            <FormItem label="菜单代码" name="menuCode">
                <Input readOnly={true} style={{ backgroundColor: 'lightgray' }} />
            </FormItem>
            <FormItem label="菜单名称" name="menuName">
                <Input />
            </FormItem>
            <FormItem label="菜单等级" name="menuClass">
                <Input readOnly={true} style={{ backgroundColor: 'lightgray' }} />
            </FormItem>
            <FormItem label="上级代码" name="parentMenuCode">
                <Input readOnly={true} style={{ backgroundColor: 'lightgray' }} />
            </FormItem>
            <FormItem label="菜单路径" name="menuPath">
                <Input />
            </FormItem>
            {(!merchantMenu) && <FormItem label="菜单状态" name="menuState">
                <Radio.Group>
                    <Radio value={0}>不可用</Radio>
                    <Radio value={1}>可用</Radio>
                </Radio.Group>
            </FormItem>}
            <FormItem label="菜单图标" name="menuIcon">
                <Select style={{ width: '100%' }}>
                    {sysIcons.map((name) => (
                        <Option key={'menuicon-' + name} value={name}>
                            <SvgIcon type={name} />
                        </Option>
                    ))}
                </Select>
            </FormItem>
            {(!IsView) && <Row justify="center">
                <Col>
                    <Space>
                        <Button
                            type="primary"
                            onClick={(e) => modifyMenu(e)}
                            icon={<SvgIcon type={'icon-jbs-testquanxianshenpi'} />}
                        >
                            更改菜单
                        </Button>
                        <Button
                            type="primary"
                            onClick={(e) => doDeleteMenu(e)}
                            icon={<SvgIcon type={'icon-jbs-testquanxianshenpi'} />}
                        >
                            删除菜单
                        </Button>
                    </Space>
                </Col>
            </Row>}
        </Form>
    );
};

export default MenuInfoForm;
