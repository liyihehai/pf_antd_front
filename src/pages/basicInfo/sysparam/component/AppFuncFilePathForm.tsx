import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';
import { saveUploadPathFactory } from '@/services/pf-basic';

const FormItem = Form.Item;
type AppFuncFilePathProp = GlobalForm.ModelProps & {
  appFuncFilePath: SysParm.AppFuncFilePath;
  appFuncFactory: SysParm.AppFuncFactory;
  onOk: (factory: SysParm.AppFuncFactory) => void;
  IsNew: boolean;
};
const AppFuncFilePathForm: React.FC<AppFuncFilePathProp> = (props) => {
  const { IsNew, appFuncFilePath, appFuncFactory } = props;
  const [form] = Form.useForm();

  const onOk = async () => {
    const values = await form.validateFields();
    const retFactory = { ...props.appFuncFactory };
    retFactory.funcPathMap = [];
    if (props.appFuncFactory.funcPathMap) {
      for (let i = 0; i < props.appFuncFactory.funcPathMap?.length; i++) {
        const item = { ...props.appFuncFactory.funcPathMap[i] };
        retFactory.funcPathMap[i] = item;
      }
    }
    const updatePath = {
      appCode: retFactory.appCode ?? '',
      funcCode: values.funcCode,
      path: values.path,
      pathMask: values.pathMask,
    };
    if (IsNew) {
      //检查新增的代码是否有重复
      if (!retFactory.funcPathMap) retFactory.funcPathMap = [];
      const index = retFactory.funcPathMap.length;
      if (index > 0) {
        for (let i = 0; i < retFactory.funcPathMap.length; i++) {
          const f = retFactory.funcPathMap[i];
          if (f.funcCode == updatePath.funcCode) {
            message.error('新增功能路径代码重复');
            return;
          }
        }
      }
      retFactory.funcPathMap[index] = updatePath;
    } else {
      if (retFactory.funcPathMap) {
        for (let i = 0; i < retFactory.funcPathMap.length; i++) {
          const f = retFactory.funcPathMap[i];
          if (f.funcCode == updatePath.funcCode) {
            retFactory.funcPathMap[i] = updatePath;
            break;
          }
        }
      }
    }
    const requestParam = {
      appCode: retFactory.appCode,
      funcPathMap: retFactory.funcPathMap,
    };
    const result = await saveUploadPathFactory(requestParam);
    if (result && result.success) {
      message.success(result.errorMessage);
      closeModal();
      props.onOk(retFactory);
    }
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
        key="btnSave"
        onClick={(e) => {
          e.preventDefault();
          onOk();
        }}
        style={{ marginLeft: 20 }}
      >
        确认
      </Button>,
    );
    return buttons;
  };

  return (
    <Modal
      className={styles.modelStyles}
      width={640}
      bodyStyle={{ padding: '15px 15px 15px' }}
      destroyOnClose
      title={'文件上传路径设置'}
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
        name="libItemModify"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <FormItem label="应用名称" name="appName" initialValue={appFuncFactory.appName}>
          <Input readOnly={true} />
        </FormItem>
        <FormItem
          label="功能编号"
          name="funcCode"
          rules={[{ required: true, message: '功能编号' }]}
          initialValue={appFuncFilePath.funcCode}
        >
          <Input readOnly={!IsNew} />
        </FormItem>
        <FormItem
          label="文件路径"
          name="path"
          rules={[{ required: true, message: '文件路径' }]}
          initialValue={appFuncFilePath.path}
        >
          <Input />
        </FormItem>
        <FormItem
          label="路径掩码"
          name="pathMask"
          rules={[{ required: true, message: '路径掩码' }]}
          initialValue={appFuncFilePath.pathMask}
        >
          <Input />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default AppFuncFilePathForm;

export const showAppFuncFilePathForm = (props?: any) => {
  const param = {
    onOk: () => {
      closeModal();
    },
    modalVisible: true,
    ...props,
  };
  showModal(AppFuncFilePathForm, param);
};
