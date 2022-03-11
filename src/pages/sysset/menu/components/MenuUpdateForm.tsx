import React, { useState } from 'react';
import { Modal, Form, Input, Row, Col, Radio, Select } from 'antd';
import { showModal, closeModal } from '@/components/Global';
import SvgIcon from '@/components/SvgIcon';
import styles from '@/components/Global/global.less';
import { saveMenuModify } from '@/services/sys-set';
import { sysIcons } from '@/components/Global/data';

const { Option } = Select;
const FormItem = Form.Item;

export type MenuProps = {
  id?: number;
  menuCode: string;
  menuName: string;
  menuClass: number;
  parentMenuCode?: string;
  menuState?: number;
  createTime?: string;
  menuPath?: string;
  menuIcon?: string;
};

export type MenuUpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: MenuProps) => void;
  onOk: (values: MenuProps) => Promise<void>;
  modalVisible: boolean;
  menu: MenuProps;
  maskClosable?: boolean;
};

const MenuUpdateForm: React.FC<MenuUpdateFormProps> = (props) => {
  const [menu, setMenu] = useState<MenuProps>(props.menu || {});

  const onmenuStateChanged = (e: any) => {
    const updateMenu = { ...menu };
    updateMenu.menuState = e.target.value;
    setMenu(updateMenu);
  };

  const [form] = Form.useForm();
  const onOk = async () => {
    try {
      const values = await form.validateFields();
      const updateMenu = { ...values, id: menu.id };
      const result = await saveMenuModify(updateMenu);
      if (result.success) props.onOk(updateMenu);
    } catch (errorInfo) {}
  };

  const onMenuCodeChanged = (e: any) => {
    if (menu.menuClass == Number(0)) {
      form.setFieldsValue({ parentMenuCode: e.target.value });
    }
  };

  return (
    <Modal
      className={styles.modelStyles}
      width={640}
      bodyStyle={{ padding: '15px 15px 15px' }}
      destroyOnClose
      title={'菜单设置'}
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
              label="菜单代码"
              name="menuCode"
              rules={[{ required: true, message: '请输入菜单代码!' }]}
              initialValue={menu.menuCode}
            >
              <Input onChange={onMenuCodeChanged} />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="菜单名称"
              name="menuName"
              rules={[{ required: true, message: '菜单名称!' }]}
              initialValue={menu.menuName}
            >
              <Input />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              label="菜单等级"
              name="menuClass"
              rules={[{ required: true, message: '菜单等级!' }]}
              initialValue={menu.menuClass}
            >
              <Input readOnly={true} />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="&nbsp;&nbsp;&nbsp;上级代码"
              name="parentMenuCode"
              initialValue={menu.parentMenuCode}
            >
              <Input readOnly={true} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem
              label="菜单路径"
              name="menuPath"
              rules={[{ required: true, message: '菜单路径!' }]}
              initialValue={menu.menuPath}
            >
              <Input style={{ width: '100%' }} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              label="菜单状态"
              name="menuState"
              rules={[{ required: true, message: '菜单状态!' }]}
              initialValue={menu.menuState}
            >
              <Radio.Group onChange={onmenuStateChanged}>
                <Radio value={0}>不可用</Radio>
                <Radio value={1}>可用</Radio>
              </Radio.Group>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="菜单图标"
              name="menuIcon"
              rules={[{ required: true, message: '菜单图标!' }]}
              initialValue={menu.menuIcon}
            >
              <Select style={{ width: '100%' }}>
                {sysIcons.map((name) => (
                  <Option key={'menuicon-' + name} value={name}>
                    <SvgIcon type={name} />
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default MenuUpdateForm;

export const showMenuUpdateForm = (props?: any) => {
  const param = {
    onOk: (menu: MenuProps) => {
      if (props.notifyMenuChanged) {
        props.notifyMenuChanged(menu);
      }
      closeModal();
    },
    ...props,
  };
  showModal(MenuUpdateForm, param);
};
