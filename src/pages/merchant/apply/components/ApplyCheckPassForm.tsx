/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';

const FormItem = Form.Item;
const { TextArea } = Input;

type ApplyCheckPassProp = MApplay.ApplyFormProps & {
  onOk: (values: MApplay.ApplyCheckPassResult) => void;
};

const ApplyCheckPassForm: React.FC<ApplyCheckPassProp> = (props) => {
  useEffect(() => {}, [props]);
  const [form] = Form.useForm();
  //渲染底部按钮
  const renderBottomButton = () => {
    const buttons = [];
    buttons.push(
      <Button key="btnClose" onClick={() => closeModal()}>
        关闭
      </Button>,
    );

    const onOk = async () => {
      try {
        const values = await form.validateFields();
        const applyPass = {
          ...values,
        };
        if (props.onOk) props.onOk(applyPass);
      } catch (errorInfo) {}
    };

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
        提交
      </Button>,
    );
    return buttons;
  };

  return (
    <Modal
      className={styles.modelStyles}
      width={550}
      bodyStyle={{ padding: '15px 15px 15px' }}
      destroyOnClose
      title={'设置审核通过信息'}
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
        name="ApplyCheckPassForm"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <FormItem label={'商户名称'} name="pmName" initialValue={props.apply.pmName}>
          <Input readOnly={true} />
        </FormItem>
        <FormItem
          label={'商户代码'}
          name="pmCode"
          rules={[{ required: true, message: '输入商户代码!' }]}
          initialValue={''}
        >
          <Input maxLength={10} />
        </FormItem>
        <FormItem
          label={'商户简称'}
          name="pmShortName"
          rules={[{ required: true, message: '输入商户简称!' }]}
          initialValue={''}
        >
          <Input maxLength={50} />
        </FormItem>
        <FormItem label={'审核说明'} name="checkDesc" initialValue={''}>
          <TextArea showCount maxLength={100} rows={5} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default ApplyCheckPassForm;

export const showApplyCheckPassForm = (props?: ApplyCheckPassProp) => {
  const param = {
    onOk: (apply: MApplay.ApplayProps) => {
      closeModal();
    },
    modalVisible: true,
    ...props,
  };
  showModal(ApplyCheckPassForm, param);
};
