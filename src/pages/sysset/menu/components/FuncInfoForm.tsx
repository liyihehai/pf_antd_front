/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { Modal, Form, Input, Radio, Select, Button, Space, Row, Col } from 'antd';
import SvgIcon from '@/components/SvgIcon';
import styles from '@/components/Global/global.less';
import { saveFunctionModify, deleteFuncByCode } from '@/services/sys-set';
import { sysIcons } from '@/components/Global/data';
import { getEnterByPath } from './FuncUpdateForm';
const { Option } = Select;
const FormItem = Form.Item;

const FuncInfoForm: React.FC<any> = (props) => {
  const func = props.func ?? {};
  const fEnterList = props.fEnterList ?? [];
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      funCode: func.funCode,
      funName: func.funName,
      funParam: func.funParam,
      menuCode: func.menuCode,
      funPath: func.funPath,
      funState: Number(func.funState),
      funIcon: func.funIcon,
      authCode: func.authCode,
    });
  });

  const modifyFunc = (e: any) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要更改功能定义吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        try {
          const values = await form.validateFields();
          const updateFunc = { ...values, id: func.id };
          const result = await saveFunctionModify(updateFunc);
          if (result && result.success && props.notifyFuncChanged) {
            props.notifyFuncChanged(func);
          }
        } catch (errorInfo) {}
      },
    });
  };
  const doDeleteFunc = (_e: any) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要删除功能定义吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const result = await deleteFuncByCode(func);
        if (result && result.success && props.notifyFuncChanged) {
          props.notifyFuncChanged();
        }
      },
    });
  };

  const onFuncPathSelect = (path: any) => {
    const enter = getEnterByPath(fEnterList, path);
    form.setFieldsValue({
      funName: enter.name,
      authCode: enter.roleRuler,
    });
  };

  return (
    <Form form={form} className={styles.modelStyles}>
      <FormItem
        label="功能代码"
        name="funCode"
        rules={[{ required: true, message: '请输入功能代码!' }]}
        initialValue={func.funCode}
      >
        <Input readOnly={true} style={{ backgroundColor: 'lightgray' }} />
      </FormItem>
      <FormItem
        label="功能名称"
        name="funName"
        rules={[{ required: true, message: '功能名称!' }]}
        initialValue={func.funName}
      >
        <Input />
      </FormItem>

      <FormItem label="&nbsp;&nbsp;&nbsp;功能参数" name="funParam" initialValue={func.funParam}>
        <Input />
      </FormItem>

      <FormItem
        label="菜单代码"
        name="menuCode"
        rules={[{ required: true, message: '菜单代码' }]}
        initialValue={func.menuCode}
      >
        <Input readOnly={true} style={{ backgroundColor: 'lightgray' }} />
      </FormItem>

      <FormItem
        label="功能路径"
        name="funPath"
        rules={[{ required: true, message: '功能路径!' }]}
        initialValue={func.funPath}
      >
        <Select style={{ width: '100%' }} onSelect={onFuncPathSelect}>
          {fEnterList.map((enter: any) => (
            <Option key={'funcPath-' + enter.path} value={enter.path}>
              <span>{'[' + enter.name + ']' + enter.path}</span>
            </Option>
          ))}
        </Select>
      </FormItem>

      <FormItem
        label="功能状态"
        name="funState"
        rules={[{ required: true, message: '功能状态!' }]}
        initialValue={func.funState}
      >
        <Radio.Group>
          <Radio value={0}>不可用</Radio>
          <Radio value={1}>可用</Radio>
        </Radio.Group>
      </FormItem>

      <FormItem
        label="功能图标"
        name="funIcon"
        rules={[{ required: true, message: '菜单图标!' }]}
        initialValue={func.funIcon}
      >
        <Select style={{ width: '100%' }}>
          {sysIcons.map((name) => (
            <Option key={'funcicon-' + name} value={name}>
              <SvgIcon type={name} />
            </Option>
          ))}
        </Select>
      </FormItem>

      <FormItem
        label="权限代码"
        name="authCode"
        rules={[{ required: true, message: '权限代码' }]}
        initialValue={func.authCode}
      >
        <Input readOnly={true} style={{ backgroundColor: 'lightgray' }} />
      </FormItem>

      <Row justify="center">
        <Col>
          <Space>
            <Button
              type="primary"
              onClick={(e) => modifyFunc(e)}
              icon={<SvgIcon type={'icon-jbs-testquanxianshenpi'} />}
            >
              更改功能
            </Button>
            <Button
              type="primary"
              onClick={(e) => doDeleteFunc(e)}
              icon={<SvgIcon type={'icon-jbs-testquanxianshenpi'} />}
            >
              删除功能
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
};

export default FuncInfoForm;
