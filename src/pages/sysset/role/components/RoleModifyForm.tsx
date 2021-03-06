/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Radio } from 'antd';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';
import SysRoleTable from './SysRoleTable';
import { saveRoleModify } from '@/services/sys-set';

const FormItem = Form.Item;

export type RoleModifyFormProps = {
  onCancel?: (flag?: boolean, formVals?: Role.RoleListItem) => void;
  onOk?: (values: Role.RoleListItem) => Promise<void>;
  sysRoleList: [];
  modalVisible?: boolean;
  role: Role.RoleListItem;
  maskClosable?: boolean;
};

const RoleModifyForm: React.FC<RoleModifyFormProps> = (props) => {
  const { sysRoleList = [] } = props;
  const [role, setRole] = useState<Role.RoleListItem>(props.role || {});
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  useEffect(() => {
    const { sysroleList } = props.role;
    if (sysroleList != undefined && sysroleList != null && sysroleList.length > 0) {
      const keys = sysroleList.split(',');
      if (keys.length > 0) {
        const rowKeys = keys.map((key) => {
          return key.replace('[', '').replace(']', '');
        });
        setSelectedRowKeys(rowKeys);
        return;
      }
    }
    setSelectedRowKeys([]);
  }, [props]);

  const onRoleStateChanged = (e: any) => {
    const updateRole = { ...role };
    updateRole.roleState = e.target.value;
    setRole(updateRole);
  };

  const onSysRoleChanged = (values: string[]) => {
    setSelectedRowKeys(values);
  };

  const [form] = Form.useForm();
  const onOk = async () => {
    try {
      let sysrList = '';
      if (selectedRowKeys.length > 0) {
        selectedRowKeys.forEach((key, index) => {
          if (index > 0) sysrList += ',';
          sysrList += '[' + key + ']';
        });
      }
      const values = await form.validateFields();
      const updateRole = { ...values, id: role.id, sysroleList: sysrList };
      const result = await saveRoleModify(updateRole);
      if (result.success && props.onOk) props.onOk(updateRole);
    } catch (errorInfo) {}
  };

  const isModify: boolean = role.id && role.id > 0 ? true : false;

  return (
    <Modal
      className={styles.modelStyles}
      width={640}
      bodyStyle={{ padding: '15px 15px 15px' }}
      destroyOnClose
      title={'????????????'}
      visible={props.modalVisible}
      maskClosable={props.maskClosable ?? false}
      okText={'??????'}
      cancelText={'??????'}
      onOk={(e) => {
        onOk();
      }}
      onCancel={() => {
        if (props.onCancel != undefined) props.onCancel();
        else closeModal();
      }}
    >
      <Form form={form} layout="horizontal" name="roleModify">
        <Row>
          <Col span={12}>
            <FormItem
              label="????????????"
              name="roleCode"
              rules={[{ required: true, message: '?????????????????????!' }]}
              initialValue={role.roleCode}
            >
              <Input readOnly={isModify} />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="????????????"
              name="roleName"
              rules={[{ required: true, message: '????????????!' }]}
              initialValue={role.roleName}
            >
              <Input />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <SysRoleTable
              sysRoleList={sysRoleList}
              selectedRowKeys={selectedRowKeys}
              onChange={onSysRoleChanged}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              label="????????????"
              name="roleState"
              rules={[{ required: true, message: '????????????!' }]}
              initialValue={role.roleState}
            >
              <Radio.Group onChange={onRoleStateChanged}>
                <Radio value={0}>?????????</Radio>
                <Radio value={1}>??????</Radio>
              </Radio.Group>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default RoleModifyForm;

export const showRoleModifyForm = (props?: any) => {
  const param = {
    onOk: (role: Role.RoleListItem) => {
      if (props.notifyRoleChanged) {
        props.notifyRoleChanged(role);
      }
      closeModal();
    },
    modalVisible: true,
    ...props,
  };
  showModal(RoleModifyForm, param);
};
