/* eslint-disable @typescript-eslint/consistent-type-imports */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Radio, Button, Select, Tabs } from 'antd';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';
import { saveMerchantSetting } from '@/services/merchant';
import ApplyMerchantTab from '../../apply/components/ApplyMerchantTab';
import ApplyIntroduceTab from '../../apply/components/ApplyIntroduceTab';
import ApplyLegalPersonTab from '../../apply/components/ApplyLegalPersonTab';
import { DefaultOptionType } from 'antd/lib/select';

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

const MerchantDetailForm: React.FC<MerSetting.MerchantFormProps> = (props) => {
  const busiTypeList: GLOBAL.StrKeyValue[] = props.busiTypeList;
  const [merchant] = useState<MerSetting.MerchantItem>(props.merchant ?? {});
  const [IsView] = useState<boolean>(props.IsView ?? false);
  const [merchantExpand, setMerchantExpand] = useState<MerSetting.MerchantExpand>(
    props.merchantExpand ?? {},
  );
  const [pmCompanyPerson, setPmCompanyPerson] = useState<number>(merchant.pmCompanyPerson ?? 1);

  useEffect(() => {}, [props]);
  const [form] = Form.useForm();

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      const updateMerchant = { ...merchant };
      updateMerchant.applyEmail = values.applyEmail;
      updateMerchant.pmCompanyPerson = values.pmCompanyPerson;
      updateMerchant.pmName = values.pmName;
      updateMerchant.pmShortName = values.pmShortName;
      const updateExpand = { ...merchantExpand };
      const updateParam = {
        merchant: updateMerchant,
        merchantExpand: updateExpand,
      };
      const result = await saveMerchantSetting(updateParam);
      if (result.success && props.onOk) props.onOk(updateMerchant);
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

  const onPmCompanyPersonChanged = (
    value: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    option: DefaultOptionType | DefaultOptionType[],
  ) => {
    setPmCompanyPerson(Number(value));
  };

  const onContentChanged = (content: MApplay.MerchantExp): void => {
    const expand = { ...merchantExpand, ...content };
    setMerchantExpand(expand);
  };

  return (
    <Modal
      className={styles.modelStyles}
      width={740}
      bodyStyle={{ padding: '15px 15px 15px' }}
      destroyOnClose
      title={'商户信息设置'}
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
        name="merchantDetailForm"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Tabs type="card" defaultValue={'0'}>
          <TabPane tab="商户信息" key="0">
            <Row>
              <Col span={12}>
                <FormItem
                  label="商户代码"
                  name="pmCode"
                  rules={[{ required: true, message: '请输入商户代码!' }]}
                  initialValue={merchant.pmCode}
                >
                  <Input readOnly={true} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="商户简称"
                  name="pmShortName"
                  rules={[{ required: true, message: '请输入商户简称!' }]}
                  initialValue={merchant.pmShortName}
                >
                  <Input readOnly={IsView} />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label="商户名称"
                  name="pmName"
                  rules={[{ required: true, message: '请输入商户名称!' }]}
                  initialValue={merchant.pmName}
                >
                  <Input readOnly={IsView} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="公司或个人"
                  name="pmCompanyPerson"
                  rules={[{ required: true, message: '公司或个人!' }]}
                  initialValue={merchant.pmCompanyPerson + ''}
                >
                  <Select
                    onChange={(value: any, option: DefaultOptionType | DefaultOptionType[]) => {
                      onPmCompanyPersonChanged(value, option);
                    }}
                  >
                    <Option key={'1'}>
                      <span>{'公司'}</span>
                    </Option>
                    <Option key={'2'}>
                      <span>{'个人'}</span>
                    </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem
                  label="商户邮箱"
                  name="applyEmail"
                  initialValue={merchant.applyEmail}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                >
                  <Input readOnly={IsView} />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem
                  label="服务状态"
                  name="pmState"
                  initialValue={merchant.pmState}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                >
                  <Radio.Group disabled={true}>
                    <Radio value={0}>未认证</Radio>
                    <Radio value={1}>可服务</Radio>
                    <Radio value={2}>已暂停</Radio>
                    <Radio value={-1}>已下架</Radio>
                  </Radio.Group>
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="商户信息" key="1">
            <ApplyMerchantTab
              content={{ ...merchantExpand }}
              IsView={IsView}
              isModify={true}
              form={form}
              onContentChanged={onContentChanged}
              busiTypeList={busiTypeList}
            />
          </TabPane>
          <TabPane tab="商户介绍" key="2">
            <ApplyIntroduceTab
              content={{ ...merchantExpand }}
              IsView={IsView}
              isModify={true}
              form={form}
              onContentChanged={onContentChanged}
            />
          </TabPane>
          <TabPane tab="商户法人" key="3">
            <ApplyLegalPersonTab
              content={{ ...merchantExpand }}
              IsView={IsView}
              isModify={true}
              form={form}
              onContentChanged={onContentChanged}
              pmCompanyPerson={pmCompanyPerson}
            />
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  );
};

export default MerchantDetailForm;

export const showMerchantDetailForm = (props?: MerSetting.MerchantFormProps) => {
  const param = {
    onOk: () => {
      closeModal();
    },
    modalVisible: true,
    ...props,
  };
  showModal(MerchantDetailForm, param);
};
