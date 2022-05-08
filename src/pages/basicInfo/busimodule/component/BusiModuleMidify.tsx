/* eslint-disable @typescript-eslint/consistent-type-imports */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Radio, Button, message } from 'antd';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';
import { saveBusinessModule } from '@/services/pf-basic';

const FormItem = Form.Item;
const { TextArea } = Input;

const BusiModuleModify: React.FC<BusiModule.BusiModuleProps> = (props) => {
  const [module, setModule] = useState<BusiModule.ModuleItem>(props.module || {});
  const [IsView] = useState<boolean>(props.IsView ?? false);
  const isModify: boolean = module.id && module.id > 0 ? true : false;

  useEffect(() => {}, [props]);
  const [form] = Form.useForm();

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      const updateObje = {
        ...values,
        id: module.id,
        actionType: isModify ? 2 : 1,
      };
      const result = await saveBusinessModule(updateObje);
      if (result.success && props.onOk) props.onOk(result.data);
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
    if (!IsView) {
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
    }
    return buttons;
  };

  return (
    <Modal
      className={styles.modelStyles}
      width={640}
      bodyStyle={{ padding: '15px 15px 15px' }}
      destroyOnClose
      title={'业务模块'}
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
        name="businessModuleModify"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <FormItem
          label="模块代码"
          name="moduleCode"
          rules={[{ required: true, message: '请输入模块代码!' }]}
          initialValue={module.moduleCode}
        >
          <Input readOnly={IsView || isModify} maxLength={20} />
        </FormItem>
        <FormItem
          label="模块名称"
          name="moduleName"
          rules={[{ required: true, message: '请输入模块名称!' }]}
          initialValue={module.moduleName}
        >
          <Input readOnly={IsView} maxLength={100} />
        </FormItem>
        <FormItem label="最新版本" name="currentVersion" initialValue={module.currentVersion}>
          <Input readOnly={IsView} maxLength={50} />
        </FormItem>
        <FormItem label="模块说明" name="moduleDesc" initialValue={module.moduleDesc}>
          <TextArea readOnly={IsView} showCount maxLength={128} rows={3} />
        </FormItem>

        <FormItem label="模块状态" name="moduleStatus" initialValue={module.moduleStatus}>
          <Radio.Group disabled={true}>
            <Radio value={0}>未上线</Radio>
            <Radio value={1}>已上线</Radio>
            <Radio value={2}>将作废</Radio>
            <Radio value={-1}>已作废</Radio>
          </Radio.Group>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default BusiModuleModify;

export const showBusiModuleModify = (IsView: boolean, props?: any) => {
  const param = {
    onOk: (module: BusiModule.ModuleItem) => {
      closeModal();
    },
    modalVisible: true,
    IsView,
    ...props,
  };
  showModal(BusiModuleModify, param);
};
