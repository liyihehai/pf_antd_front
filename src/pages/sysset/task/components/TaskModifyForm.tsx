/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Select, Button } from 'antd';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';
import { addTaskJob, updateTaskJob } from '@/services/sys-set';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

export type TaskModifyFormProps = {
  onCancel?: (flag?: boolean, formVals?: Task.TaskJob) => void;
  onOk?: (values: Task.TaskJob) => Promise<void>;
  beanMethodList: Task.BeanMethod[];
  modalVisible?: boolean;
  task: Task.TaskJob;
  maskClosable?: boolean;
  IsView: boolean;
};

const TaskModifyForm: React.FC<TaskModifyFormProps> = (props) => {
  const beanMethodList = props.beanMethodList;
  const IsView = props.IsView;
  const [task, setTask] = useState<Task.TaskJob>(props.task || {});
  const [methodList, setMethodList] = useState<string[]>([]);

  const reSetMethodSel = (beanName: string) => {
    if (beanMethodList && beanMethodList.length > 0) {
      for (let i = 0; i < beanMethodList.length; i++) {
        if (beanName == beanMethodList[i].beanName) {
          setMethodList(beanMethodList[i].methodList);
        }
      }
    }
  };

  useEffect(() => {
    reSetMethodSel(task.moduleName);
  }, [props]);

  const isModify: boolean = task.taskCode && task.taskCode.length > 0 ? true : false;

  const [form] = Form.useForm();

  const onBeanChanged = (e: string) => {
    reSetMethodSel(e);
    form.setFieldsValue({ methodName: '' });
  };

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      let update;
      let result;
      if (isModify) {
        update = { ...values, taskCode: task.taskCode };
        result = await updateTaskJob(update);
      } else {
        update = { ...values };
        result = await addTaskJob(update);
      }
      if (result.success && props.onOk) {
        props.onOk(update);
        closeModal();
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
          确认
        </Button>,
      );
    }
    return buttons;
  };

  return (
    <Modal
      className={styles.modelStyles}
      width={750}
      bodyStyle={{ padding: '15px 15px 15px' }}
      destroyOnClose
      title={'自动任务设置'}
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
        name="taskModify"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Row>
          <Col span={12}>
            <FormItem
              label="任务代码"
              name="taskCode"
              rules={[{ required: true, message: '请输入任务代码!' }]}
              initialValue={task.taskCode}
            >
              <Input readOnly={IsView || isModify} />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="任务名称"
              name="taskName"
              rules={[{ required: true, message: '任务名称!' }]}
              initialValue={task.taskName}
            >
              <Input readOnly={IsView} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem
              label="任务模块"
              name="moduleName"
              rules={[{ required: true, message: '任务模块!' }]}
              initialValue={task.moduleName}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              <Select style={{ width: '100%' }} onSelect={onBeanChanged} disabled={IsView}>
                {beanMethodList.map((enter: any) => (
                  <Option key={'bean-' + enter.beanName} value={enter.beanName}>
                    <span>{enter.beanName}</span>
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              label="任务方法"
              name="methodName"
              rules={[{ required: true, message: '请输入任务方法!' }]}
              initialValue={task.methodName}
            >
              <Select style={{ width: '100%' }} disabled={IsView}>
                {methodList.map((name: string) => (
                  <Option key={'method-' + name} value={name}>
                    <span>{name}</span>
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="执行时间"
              name="taskCorn"
              rules={[{ required: true, message: '执行时间!' }]}
              initialValue={task.taskCorn}
            >
              <Input readOnly={IsView} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem
              label="任务参数"
              name="param"
              initialValue={task.param}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              <TextArea showCount maxLength={128} rows={4} readOnly={IsView} />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default TaskModifyForm;

export const showTaskModifyForm = (props?: any) => {
  const param = {
    onOk: (task: Task.TaskJob) => {
      closeModal();
    },
    modalVisible: true,
    IsView: true,
    ...props,
  };
  showModal(TaskModifyForm, param);
};
