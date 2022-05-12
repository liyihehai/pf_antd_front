import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Button, Tabs, Radio, message } from 'antd';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';
import {
  merchantCreateUTIAccount,
  merchantUTIAccountReset,
  utiAccountGenKeys,
} from '@/services/merchant';

const FormItem = Form.Item;
const { TextArea } = Input;
const { TabPane } = Tabs;

const MerchantUtiAccount: React.FC<MerSetting.UtiAccountProps> = (props) => {
  const [utiAccount, setUtiAccount] = useState<MerSetting.MerchantUtiAccount>(
    props.utiAccount ?? {},
  );
  const [pmShortName] = useState<string>(props.pmShortName ?? '');
  const [state, setState] = useState<number>(utiAccount.accountState ?? 0);
  const [tabSel, setTabSel] = useState<string>('0');

  useEffect(() => {}, [props]);
  const [form] = Form.useForm();

  const onAccountStateChange = (e: any) => {
    setState(e.target.value);
  };
  const onTabChanged = (e: any) => {
    setTabSel(e);
  };

  const onOk = async () => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要保存商户UTI账户设置吗?更改秘钥可能会导致交易验签失败!',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const values = await form.validateFields();
        const update = { ...utiAccount, ...values };
        const result = await merchantUTIAccountReset(update);
        if (result && result.success) {
          message.success(result.errorMessage);
          if (props.onOk) props.onOk(result.data);
          else closeModal();
        }
      },
    });
  };

  const openUtiAccount = async () => {
    try {
      const values = await form.validateFields();
      const update = { ...utiAccount, ...values };
      const result = await merchantCreateUTIAccount(update);
      if (result && result.success) {
        setUtiAccount(result.data);
      }
    } catch (errorInfo) {}
  };

  const onGenKeys = async () => {
    const result = await utiAccountGenKeys({});
    if (result && result.success) {
      if (tabSel == '1') {
        form.setFieldsValue({
          appRsaPubkey: result.data.RSAPublicKey,
          appRsaPrikey: result.data.RSAPrivateKey,
        });
      } else if (tabSel == '2') {
        form.setFieldsValue({
          merRsaPubkey: result.data.RSAPublicKey,
          merRsaPrikey: result.data.RSAPrivateKey,
        });
      }
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
    if (utiAccount.accountCode) {
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
    } else {
      buttons.push(
        <Button
          type="primary"
          key="btnSave"
          onClick={(e) => {
            e.preventDefault();
            openUtiAccount();
          }}
          style={{ marginLeft: 20 }}
        >
          开通UTI账户
        </Button>,
      );
    }
    return buttons;
  };

  const operations =
    tabSel == '1' || tabSel == '2' ? <Button onClick={onGenKeys}>生成秘钥</Button> : <></>;

  return (
    <Modal
      className={styles.modelStyles}
      width={740}
      bodyStyle={{ padding: '15px 15px 15px' }}
      destroyOnClose
      title={'商户UTI账户设置'}
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
        name="merchantUtiAccount"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Tabs
          type="card"
          defaultValue={tabSel}
          onChange={onTabChanged}
          tabBarExtraContent={operations}
        >
          <TabPane tab="账户信息" key="0">
            <Row>
              <Col span={12}>
                <FormItem
                  label="商户代码"
                  name="pmCode"
                  rules={[{ required: true, message: '请输入商户代码!' }]}
                  initialValue={utiAccount.pmCode}
                >
                  <Input readOnly={true} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="商户简称"
                  name="pmShortName"
                  rules={[{ required: true, message: '请输入商户简称!' }]}
                  initialValue={pmShortName}
                >
                  <Input readOnly={true} />
                </FormItem>
              </Col>
            </Row>
            {utiAccount.accountCode && (
              <>
                <Row>
                  <Col span={12}>
                    <FormItem
                      label="账户代码"
                      name="accountCode"
                      rules={[{ required: true, message: '请输入账户代码!' }]}
                      initialValue={utiAccount.accountCode}
                    >
                      <Input readOnly={true} />
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      label="账户密码"
                      name="accountPws"
                      rules={[{ required: true, message: '账户密码!' }]}
                      initialValue={utiAccount.accountPws}
                    >
                      <Input.Password readOnly={true} />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem
                      label="默认回调地址"
                      name="defBackUrl"
                      initialValue={utiAccount.defBackUrl}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                    >
                      <Input />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem
                      label="有效IP"
                      name="validIpList"
                      initialValue={utiAccount.validIpList}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                    >
                      <Input />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      label="商户认证号"
                      name="backId"
                      rules={[{ required: false, message: '请输入商户认证号!' }]}
                      initialValue={utiAccount.backId}
                    >
                      <Input />
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      label="商户认证密码"
                      name="backKey"
                      rules={[{ required: false, message: '请输入商户认证密码!' }]}
                      initialValue={utiAccount.backKey}
                    >
                      <Input.Password placeholder={'请输入密码'} autoComplete="new-password" />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem
                      label="账户状态"
                      name="accountState"
                      initialValue={utiAccount.accountState}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                    >
                      <Radio.Group onChange={onAccountStateChange} value={state}>
                        <Radio value={0}>新建</Radio>
                        <Radio value={1}>开通</Radio>
                        <Radio value={2}>暂停</Radio>
                        <Radio value={3}>注销</Radio>
                      </Radio.Group>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem
                      label="账户备注"
                      name="accountMemo"
                      initialValue={utiAccount.accountMemo}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                    >
                      <TextArea showCount maxLength={200} rows={3} />
                    </FormItem>
                  </Col>
                </Row>
              </>
            )}
          </TabPane>
          {utiAccount.accountCode && (
            <TabPane tab="APP秘钥" key="1">
              <Row>
                <Col span={24}>
                  <FormItem
                    label="APP RSA公钥"
                    name="appRsaPubkey"
                    initialValue={utiAccount.appRsaPubkey}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <TextArea showCount maxLength={2048} rows={5} />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem
                    label="APP RSA私钥"
                    name="appRsaPrikey"
                    initialValue={utiAccount.appRsaPrikey}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <TextArea showCount maxLength={2048} rows={5} />
                  </FormItem>
                </Col>
              </Row>
            </TabPane>
          )}
          {utiAccount.accountCode && (
            <TabPane tab="商户秘钥" key="2">
              <Row>
                <Col span={24}>
                  <FormItem
                    label="商户 RSA公钥"
                    name="merRsaPubkey"
                    initialValue={utiAccount.merRsaPubkey}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <TextArea showCount maxLength={2048} rows={5} />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem
                    label="商户 RSA私钥"
                    name="merRsaPrikey"
                    initialValue={utiAccount.merRsaPrikey}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <TextArea showCount maxLength={2048} rows={5} />
                  </FormItem>
                </Col>
              </Row>
            </TabPane>
          )}
        </Tabs>
      </Form>
    </Modal>
  );
};

export default MerchantUtiAccount;

export const showMerchantUtiAccount = (props?: MerSetting.UtiAccountProps) => {
  const param = {
    onOk: () => {
      closeModal();
    },
    modalVisible: true,
    ...props,
  };
  showModal(MerchantUtiAccount, param);
};
