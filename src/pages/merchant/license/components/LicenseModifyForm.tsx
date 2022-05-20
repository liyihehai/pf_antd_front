/* eslint-disable @typescript-eslint/consistent-type-imports */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Radio, Button, Select,} from 'antd';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';
import { saveMerchantApply } from '@/services/merchant';

const FormItem = Form.Item;
const Option = Select.Option;
const { Search } = Input;

type LFormProp = GLOBAL.FormProps & {
  license: License.AppLicense;
  IsView: boolean;
  busiAppList: GLOBAL.StrKeyValue[];
  busiModuleList: GLOBAL.StrKeyValue[];
};
const LicenseModifyForm: React.FC<LFormProp> = (props) => {
  const busiAppList: GLOBAL.StrKeyValue[] = props.busiAppList;
  const busiModuleList: GLOBAL.StrKeyValue[] = props.busiModuleList;
  const license: License.AppLicense = props.license;
  const [IsView] = useState<boolean>(props.IsView ?? false);
  const isModify: boolean = license.id && license.id > 0 ? true : false;

  useEffect(() => {}, [props]);
  const [form] = Form.useForm();

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      const updateApply = {
        ...values,
        id: license.id
      };
      const result = await saveMerchantApply(updateApply);
      if (result.success && props.onOk) props.onOk(updateApply);
    } catch (errorInfo) {}
  };

  const onSearchMerchant = () => {
    
  }

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
      title={'商户许可'}
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
        name="merchantLicenseModify"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        
                <FormItem
                  label="商户名称"
                  name="pmName"
                  rules={[{ required: true, message: '请输入商户名称!' }]}
                  initialValue={license.pmName}
                >
          <Search readOnly={true} placeholder="输入商户" onSearch={onSearchMerchant} style={{ width: 200 }} />
                </FormItem>
                <FormItem label="选择应用" name="appCode" initialValue={license.appCode}>
                <Select>
            {busiAppList.map((app: GLOBAL.StrKeyValue) => {
              <Option key={app.key}>
              <span>{app.value}</span>
            </Option>
            })}
                  </Select>
                </FormItem>
             
                <FormItem label="选择模块" name="moduleCode" initialValue={license.moduleCode}>
                <Select>
            {busiModuleList.map((app: GLOBAL.StrKeyValue) => {
              <Option key={app.key}>
              <span>{app.value}</span>
            </Option>
            })}
                  </Select>
                </FormItem>
      </Form>
    </Modal>
  );
};

export default LicenseModifyForm;

export const showLicenseModifyForm = (IsView: boolean, props?: any) => {
  const param = {
    onOk: (obj: License.AppLicense) => {
      closeModal();
    },
    modalVisible: true,
    IsView,
    ...props,
  };
  showModal(LicenseModifyForm, param);
};
