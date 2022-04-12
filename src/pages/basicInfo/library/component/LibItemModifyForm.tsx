/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Button, InputNumber } from 'antd';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';
import { saveLibraryItem } from '@/services/pf-basic';

const FormItem = Form.Item;
const { TextArea } = Input;

type LFormProp = Libr.LibFormProps & {
  lsView?: boolean;
};
const LibItemModifyForm: React.FC<LFormProp> = (props) => {
  const [libItem] = useState<Libr.LibItem>(props.libItem ?? {});
  const [lsView] = useState<boolean>(props.lsView ?? false);
  const isModify: boolean = libItem.id && libItem.id > 0 ? true : false;

  useEffect(() => {}, [props]);
  const [form] = Form.useForm();

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      const updateObj = {
        ...libItem,
        ...values,
        libTypeCode: libItem.libTypeCode,
        id: libItem.id,
        actionType: isModify ? 2 : 1,
      };
      const result = await saveLibraryItem(updateObj);
      if (result.success && props.onOk) props.onOk(updateObj);
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

  return (
    <Modal
      className={styles.modelStyles}
      width={640}
      bodyStyle={{ padding: '15px 15px 15px' }}
      destroyOnClose
      title={'字典项设置'}
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
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Row>
          <Col span={20}>
            <FormItem
              label="选项分类"
              name="libTypeName"
              rules={[{ required: true, message: '请输入商户名称!' }]}
              initialValue={libItem.libTypeName}
            >
              <Input readOnly={true} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={20}>
            <FormItem
              label="分项编号"
              name="typeItemCode"
              rules={[{ required: true, message: '分项编号' }]}
              initialValue={libItem.typeItemCode}
            >
              <Input readOnly={lsView} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={20}>
            <FormItem
              label="分项名称"
              name="typeItemName"
              rules={[{ required: true, message: '分项名称' }]}
              initialValue={libItem.typeItemName + ''}
            >
              <Input readOnly={lsView} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={20}>
            <FormItem
              label="分项排序"
              name="itemSort"
              rules={[
                {
                  required: true,
                  pattern: new RegExp(/^[0-9]\d*$/, 'g'),
                  message: '请输入正确的排序数值',
                },
              ]}
              initialValue={libItem.itemSort}
            >
              <InputNumber readOnly={lsView} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={20}>
            <FormItem label="分项备注" name="remark" initialValue={libItem.remark}>
              <TextArea readOnly={lsView} showCount maxLength={128} rows={5} />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default LibItemModifyForm;

export const showLibItemModifyForm = (props?: any) => {
  const param = {
    onOk: (apply: Libr.LibItem) => {
      if (props.notifyModifyChanged) {
        props.notifyModifyChanged(apply);
      }
      closeModal();
    },
    modalVisible: true,
    ...props,
  };
  showModal(LibItemModifyForm, param);
};
