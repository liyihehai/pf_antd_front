/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';
import { setPwsPriCheck, setOperatorPws } from '@/services/sys-set';
import { AES_ECB_encrypt } from '@/secret';

const FormItem = Form.Item;

const OpePasswordForm: React.FC<Ope.OpeFormProps> = (props) => {
  const [operator] = useState<Ope.OperatorItem>(props.operator || {});

  useEffect(() => {}, [props]);
  const [form] = Form.useForm();

  const doSetOperatorPws = async (opeCode: string, setAimPwd: string) => {
    const result = await setPwsPriCheck(opeCode);
    if (result && result.success) {
      const param = {
        opeCode,
        setAimPwd: AES_ECB_encrypt(setAimPwd, result.data),
      };
      const setResult = await setOperatorPws(param);
      if (setResult && setResult.success) {
        message.success(setResult.errorMessage);
        if (props.onOk) props.onOk({});
      }
    }
  };

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      if (!operator.opeCode) {
        message.error('不能确定待设置密码的操作员！');
        return;
      }
      const { setAimPwd, comfireAimPwd } = values;
      if (!setAimPwd || !comfireAimPwd) {
        message.error('密码和确认密码不能为空！');
        return;
      }
      if (setAimPwd != comfireAimPwd) {
        message.error('密码和确认密码不一致！');
        return;
      }
      doSetOperatorPws(operator.opeCode, setAimPwd);
    } catch (errorInfo) {}
  };

  return (
    <Modal
      className={styles.modelStyles}
      width={450}
      bodyStyle={{ padding: '15px 15px 15px' }}
      destroyOnClose
      title={'密码设置'}
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
      <Form form={form} layout="horizontal" name="operatorPassword">
        <FormItem label="操作员代码" name="opeCode" initialValue={operator.opeCode}>
          <Input readOnly={true} />
        </FormItem>
        <FormItem label="操作员姓名" name="opeName" initialValue={operator.opeName}>
          <Input readOnly={true} />
        </FormItem>
        <FormItem label="请输入密码" name="setAimPwd">
          <Input.Password placeholder="输入密码" />
        </FormItem>
        <FormItem label="请确认密码" name="comfireAimPwd">
          <Input.Password placeholder="确认密码" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default OpePasswordForm;

export const showOpePasswordForm = (props?: any) => {
  const param = {
    onOk: (operator: Ope.OperatorItem) => {
      closeModal();
    },
    modalVisible: true,
    ...props,
  };
  showModal(OpePasswordForm, param);
};
