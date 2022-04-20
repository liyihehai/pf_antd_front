/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';

const FormItem = Form.Item;
const { TextArea } = Input;

const TitleAreaTextForm: React.FC<GlobalForm.TitleAreaTextProps> = (props) => {
  const [keyValue] = useState<any>(props.keyValue ?? null);
  const [textValue, setTextValue] = useState<string>(props.textValue ?? '');
  const [form] = Form.useForm();

  useEffect(() => {}, [props]);

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      const tv = values.textValue;
      if (!tv || tv.length <= 0) {
        message.error(props.textLabel + '没有输入任何文本');
        return;
      }
      if (props.onConfirm) {
        props.onConfirm({ keyValue, textValue: values.textValue });
        return;
      }
    } catch (errorInfo) {}
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
      title={props.title}
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
        name="titleAreaTextForm"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <FormItem label={props.keyLabel} name="textKey" initialValue={props.keyName}>
          <Input readOnly={true} />
        </FormItem>
        <FormItem label={props.textLabel} name="textValue" initialValue={textValue}>
          <TextArea showCount maxLength={props.maxLength ?? 100} rows={5} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default TitleAreaTextForm;

export const showTitleAreaTextForm = (props?: GlobalForm.TitleAreaTextProps) => {
  const param = {
    onConfirm: (result: GlobalForm.TitleAreaTextResult) => {
      closeModal();
    },
    modalVisible: true,
    ...props,
  };
  showModal(TitleAreaTextForm, param);
};
