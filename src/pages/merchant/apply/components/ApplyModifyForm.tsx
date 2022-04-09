/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Radio, Button, Select, Tabs } from 'antd';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';
import { saveMerchantApply } from '@/services/merchant';
import ApplyMerchantTab from './ApplyMerchantTab';
import ApplyIntroduceTab from './ApplyIntroduceTab';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { TabPane } = Tabs;

type AFormProp = MApplay.ApplyFormProps & {
  lsView?: boolean;
};
const ApplyModifyForm: React.FC<AFormProp> = (props) => {
  const [apply, setApply] = useState<MApplay.ApplayProps>(props.apply || {});
  const [lsView] = useState<boolean>(props.lsView ?? false);
  const isModify: boolean = apply.id && apply.id > 0 ? true : false;

  const [applyContent, setApplyContent] = useState<MApplay.MerchantExp>(
    apply.applyContent ? JSON.parse(apply.applyContent) : {},
  );

  useEffect(() => {}, [props]);
  const [form] = Form.useForm();

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      const updateApply = { ...values, id: apply.id, actionType: isModify ? 2 : 1 };
      const result = await saveMerchantApply(updateApply);
      if (result.success && props.onOk) props.onOk(updateApply);
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
    if (!lsView) {
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

  const onContentChanged = (content: MApplay.MerchantExp): void => {
    console.info(content);
    setApplyContent(content);
  };

  return (
    <Modal
      className={styles.modelStyles}
      width={740}
      bodyStyle={{ padding: '15px 15px 15px' }}
      destroyOnClose
      title={'商户申请'}
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
        name="merchantApplyModify"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Tabs type="card" defaultValue={'0'}>
          <TabPane tab="申请信息" key="0">
            <Row>
              <Col span={12}>
                <FormItem
                  label="商户名称"
                  name="pmName"
                  rules={[{ required: true, message: '请输入商户名称!' }]}
                  initialValue={apply.pmName}
                >
                  <Input readOnly={lsView} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="公司或个人"
                  name="pmCompanyPerson"
                  rules={[{ required: true, message: '公司或个人!' }]}
                  initialValue={apply.pmCompanyPerson + ''}
                >
                  <Select>
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
              <Col span={12}>
                <FormItem
                  label="验证方式"
                  name="confirmType"
                  rules={[{ required: true, message: '请输入验证方式!' }]}
                  initialValue={apply.confirmType + ''}
                >
                  <Select>
                    <Option key={'1'}>
                      <span>{'邮箱'}</span>
                    </Option>
                    <Option key={'2'}>
                      <span>{'电话'}</span>
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="申请方式"
                  name="applyWays"
                  rules={[{ required: true, message: '申请方式!' }]}
                  initialValue={apply.applyWays + ''}
                >
                  <Select>
                    <Option key={'1'}>
                      <span>{'操作员申请'}</span>
                    </Option>
                    <Option key={'2'}>
                      <span>{'网站自助申请'}</span>
                    </Option>
                    <Option key={'3'}>
                      <span>{'APP自助申请'}</span>
                    </Option>
                    <Option key={'4'}>
                      <span>{'业务员申请'}</span>
                    </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="验证电话" name="applyPhone" initialValue={apply.applyPhone}>
                  <Input readOnly={lsView} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="验证邮箱" name="applyEmail" initialValue={apply.applyEmail}>
                  <Input readOnly={lsView} />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="申请人代码" name="applyerCode" initialValue={apply.applyerCode}>
                  <Input readOnly={lsView} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="申请人姓名" name="applyerName" initialValue={apply.applyerName}>
                  <Input readOnly={lsView} />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem
                  label="申请备注"
                  name="applyMemo"
                  initialValue={apply.applyMemo}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                >
                  <TextArea readOnly={lsView} showCount maxLength={100} rows={3} />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem
                  label="申请状态"
                  name="applyState"
                  initialValue={apply.applyState}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                >
                  <Radio.Group>
                    <Radio value={0}>申请编辑</Radio>
                    <Radio value={1}>申请通过</Radio>
                    <Radio value={2}>待审核</Radio>
                    <Radio value={3}>申请未通过</Radio>
                    <Radio value={4}>待分配</Radio>
                  </Radio.Group>
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="商户信息" key="1">
            <ApplyMerchantTab
              content={applyContent}
              lsView={lsView}
              isModify={isModify}
              form={form}
              onContentChanged={onContentChanged}
            />
          </TabPane>
          <TabPane tab="商户介绍" key="2">
            <ApplyIntroduceTab
              content={applyContent}
              lsView={lsView}
              isModify={isModify}
              form={form}
              onContentChanged={onContentChanged}
            />
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  );
};

export default ApplyModifyForm;

export const showApplyModifyForm = (props?: any) => {
  const param = {
    onOk: (apply: MApplay.ApplayProps) => {
      if (props.notifyModifyChanged) {
        props.notifyModifyChanged(apply);
      }
      closeModal();
    },
    modalVisible: true,
    ...props,
  };
  showModal(ApplyModifyForm, param);
};
