/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, Radio } from 'antd';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';
import { saveOperatorModify } from '@/services/sys-set';

const FormItem = Form.Item;
const { Option } = Select;

const OpeModifyForm: React.FC<Ope.OpeFormProps> = (props) => {
  const [operator, setOperator] = useState<Ope.OperatorItem>(props.operator || {});
  const isModify: boolean = operator.id && operator.id > 0 ? true : false;

  useEffect(() => {}, [props]);
  const [form] = Form.useForm();
  const onOk = async () => {
    try {
      const values = await form.validateFields();
      const updateOperator = { ...values, id: operator.id, actionType: isModify ? 2 : 1 };
      const result = await saveOperatorModify(updateOperator);
      if (result.success && props.onOk) props.onOk(updateOperator);
    } catch (errorInfo) {}
  };

  const onOperatorStateChanged = (e: any) => {
    const updateOperator = { ...operator };
    updateOperator.opeState = e.target.value;
    setOperator(updateOperator);
  };

  const onOperatorTypeSelected = (e: any) => {
    const updateOperator = { ...operator };
    updateOperator.opeType = Number(e);
    setOperator(updateOperator);
  };

  return (
    <Modal
      className={styles.modelStyles}
      width={640}
      bodyStyle={{ padding: '15px 15px 15px' }}
      destroyOnClose
      title={'操作员设置'}
      visible={props.modalVisible}
      maskClosable={props.maskClosable ?? false}
      okText={'确认'}
      cancelText={'取消'}
      onOk={(e) => {
        onOk();
      }}
      onCancel={() => {
        if (props.onCancel != undefined) props.onCancel();
        else closeModal();
      }}
    >
      <Form form={form} layout="horizontal" name="operatorModify">
        <Row>
          <Col span={12}>
            <FormItem
              label="操作员代码"
              name="opeCode"
              rules={[{ required: true, message: '请输入操作员代码!' }]}
              initialValue={operator.opeCode}
            >
              <Input readOnly={isModify} />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="操作员名称"
              name="opeName"
              rules={[{ required: true, message: '请输入操作员名称!' }]}
              initialValue={operator.opeName}
            >
              <Input />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              label="操作员类型"
              name="opeType"
              rules={[{ required: true, message: '请输入操作员类型!' }]}
              initialValue={operator.opeType + ''}
            >
              <Select onSelect={onOperatorTypeSelected}>
                <Option key={'1'}>
                  <span>{'超级管理员'}</span>
                </Option>
                <Option key={'2'}>
                  <span>{'普通操作员'}</span>
                </Option>
                <Option key={'3'}>
                  <span>{'自动操作员'}</span>
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="&nbsp;&nbsp;&nbsp;操作员手机"
              name="opeMobile"
              rules={[{ required: false, message: '请输入操作员手机!' }]}
              initialValue={operator.opeMobile}
            >
              <Input />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              label="操作员状态"
              name="opeState"
              rules={[{ required: true, message: '请输入操作员状态!' }]}
              initialValue={operator.opeState}
            >
              <Radio.Group onChange={onOperatorStateChanged}>
                <Radio value={0}>不可用</Radio>
                <Radio value={1}>可用</Radio>
              </Radio.Group>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default OpeModifyForm;

export const showOpeModifyForm = (props?: any) => {
  const param = {
    onOk: (operator: Ope.OperatorItem) => {
      if (props.notifyOperatorChanged) {
        props.notifyOperatorChanged(operator);
      }
      closeModal();
    },
    modalVisible: true,
    ...props,
  };
  showModal(OpeModifyForm, param);
};
