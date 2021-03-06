/* eslint-disable @typescript-eslint/consistent-type-imports */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Radio, Button, Select, Tabs, message } from 'antd';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';
import { saveMerchantApply, sendApplyVerifySM } from '@/services/merchant';
import ApplyMerchantTab from './ApplyMerchantTab';
import ApplyIntroduceTab from './ApplyIntroduceTab';
import ApplyLegalPersonTab from './ApplyLegalPersonTab';
import { DefaultOptionType } from 'antd/lib/select';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { TabPane } = Tabs;

type AFormProp = MApplay.ApplyFormProps & {
  IsView: boolean;
  busiTypeList: GLOBAL.StrKeyValue[];
};
const ApplyModifyForm: React.FC<AFormProp> = (props) => {
  const busiTypeList: GLOBAL.StrKeyValue[] = props.busiTypeList;
  const [apply, setApply] = useState<MApplay.ApplayProps>(props.apply || {});
  const [smRandCodeDisabled, setSmRandCodeDisabled] = useState<boolean>(false);
  const [count, setCount] = useState<string>('验证码');
  const [IsView] = useState<boolean>(props.IsView ?? false);
  const isModify: boolean = apply.id && apply.id > 0 ? true : false;

  const [applyContent, setApplyContent] = useState<MApplay.MerchantExp>(
    apply.applyContent ? JSON.parse(apply.applyContent) : {},
  );
  const [pmCompanyPerson, setPmCompanyPerson] = useState<number>(apply.pmCompanyPerson ?? 1);
  const [confirmType, setConfirmType] = useState<string>(apply.confirmType + '' ?? '1');

  useEffect(() => {}, [props]);
  const [form] = Form.useForm();

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      const applyContentString = JSON.stringify(applyContent);
      const updateApply = {
        ...values,
        id: apply.id,
        applyPhone: apply.applyPhone,
        applyContent: applyContentString,
        actionType: isModify ? 2 : 1,
      };
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
    setApplyContent(content);
  };

  const onConfirmTypeChanged = (type: string) => {
    setConfirmType(type);
  };

  const onApplyPhoneChanged = (phone: any) => {
    const updateApply = { ...apply };
    updateApply.applyPhone = phone.target.value;
    setApply(updateApply);
  };

  let sm_timer: NodeJS.Timer | number = 0;
  const clearSmTimer = () => {
    if (sm_timer != 0) {
      clearInterval(sm_timer as NodeJS.Timer);
      sm_timer = 0;
    }
    setCount('验证码');
    setSmRandCodeDisabled(false);
  };
  const setTimer = () => {
    setSmRandCodeDisabled(true);
    let counts = 60;
    sm_timer = setInterval(() => {
      setCount(`${counts--}s`);
      if (counts < -1) {
        clearSmTimer();
      }
    }, 1000);
  };

  const QuerySmRandomCode = async () => {
    const updateApply = {
      ...apply,
    };
    const result = await sendApplyVerifySM(updateApply);
    if (result) {
      if (result.success) message.success(result.errorMessage);
      else {
        clearSmTimer();
        message.error(result.errorMessage);
      }
    } else clearSmTimer();
  };

  const onQuerySmRandomCode = () => {
    try {
      setTimer();
      QuerySmRandomCode();
    } catch (errorInfo) {}
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
                  <Input readOnly={IsView} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="公司或个人"
                  name="pmCompanyPerson"
                  rules={[{ required: true, message: '公司或个人!' }]}
                  initialValue={apply.pmCompanyPerson + ''}
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
              <Col span={12}>
                <FormItem
                  label="验证方式"
                  name="confirmType"
                  rules={[{ required: true, message: '请输入验证方式!' }]}
                  initialValue={confirmType}
                >
                  <Select
                    onChange={(value) => {
                      onConfirmTypeChanged(value);
                    }}
                  >
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
            {confirmType == '2' && (
              <Row>
                <Col span={12}>
                  <FormItem label="验证电话">
                    {!IsView && (
                      <Input.Group compact>
                        <Input
                          value={apply.applyPhone}
                          style={{ width: 'calc(100% - 75px)' }}
                          maxLength={11}
                          onChange={(value: any) => {
                            onApplyPhoneChanged(value);
                          }}
                        />
                        <Button
                          type="primary"
                          disabled={smRandCodeDisabled}
                          onClick={() => {
                            onQuerySmRandomCode();
                          }}
                          style={{ width: '75px' }}
                        >
                          {count}
                        </Button>
                      </Input.Group>
                    )}
                    {IsView && <Input readOnly={IsView} />}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label="短信验证码"
                    name="smRandomCode"
                    initialValue={apply.smRandomCode}
                  >
                    <Input readOnly={IsView} maxLength={6} />
                  </FormItem>
                </Col>
              </Row>
            )}
            {confirmType == '1' && (
              <Row>
                <Col span={24}>
                  <FormItem
                    label="验证邮箱"
                    name="applyEmail"
                    initialValue={apply.applyEmail}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <Input readOnly={IsView} />
                  </FormItem>
                </Col>
              </Row>
            )}
            <Row>
              <Col span={12}>
                <FormItem label="申请人代码" name="applyerCode" initialValue={apply.applyerCode}>
                  <Input readOnly={IsView} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="申请人姓名" name="applyerName" initialValue={apply.applyerName}>
                  <Input readOnly={IsView} />
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
                  <TextArea readOnly={IsView} showCount maxLength={100} rows={3} />
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
                  <Radio.Group disabled={true}>
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
              IsView={IsView}
              isModify={isModify}
              form={form}
              onContentChanged={onContentChanged}
              busiTypeList={busiTypeList}
            />
          </TabPane>
          <TabPane tab="商户介绍" key="2">
            <ApplyIntroduceTab
              content={applyContent}
              IsView={IsView}
              isModify={isModify}
              form={form}
              onContentChanged={onContentChanged}
            />
          </TabPane>
          <TabPane tab="商户法人" key="3">
            <ApplyLegalPersonTab
              content={applyContent}
              IsView={IsView}
              isModify={isModify}
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

export default ApplyModifyForm;

export const showApplyModifyForm = (IsView: boolean, props?: any) => {
  const param = {
    onOk: (apply: MApplay.ApplayProps) => {
      if (props.notifyModifyChanged) {
        props.notifyModifyChanged(apply);
      }
      closeModal();
    },
    modalVisible: true,
    IsView,
    ...props,
  };
  showModal(ApplyModifyForm, param);
};
