/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import styles from '@/components/Global/global.less';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Modal } from 'antd';
import {
  taskJobPageList,
  deleteTaskJob,
  setTaskJobWaiting,
  setTaskJobPause,
  forceExecute,
} from '@/services/sys-set';
import { showTaskModifyForm } from './components/TaskModifyForm';

let setFunctionButtonClickTime: Date = new Date('2000-01-01 00:00:00');

const TaskList: React.FC = () => {
  const [taskJobList, setTaskJobList] = useState<Task.TaskJob[]>([]);
  const [beanMethodList, setBeanMethodList] = useState<Task.BeanMethod[]>([]);
  useEffect(() => {}, []);
  const actionRef = useRef<ActionType>();

  const reload = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  const modifyTask = (record: Task.TaskJob) => {
    showTaskModifyForm({
      beanMethodList,
      task: record,
      onOk: (curTask: Task.TaskJob) => {
        if (curTask) reload();
      },
      IsView: false,
    });
  };

  const taskJobDetail = (record: Task.TaskJob) => {
    showTaskModifyForm({
      beanMethodList,
      task: record,
    });
  };

  const deleteTask = (record: Task.TaskJob) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要删除自动任务[' + record.taskCode + ':' + record.taskName + ']定义吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const result = await deleteTaskJob(record);
        if (result && result.success) {
          reload();
        }
      },
    });
  };

  const taskJobWaiting = (record: Task.TaskJob) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要设置自动任务[' + record.taskCode + ':' + record.taskName + ']开始等待执行吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const result = await setTaskJobWaiting(record);
        if (result && result.success) {
          reload();
        }
      },
    });
  };

  const taskJobPause = (record: Task.TaskJob) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要设置自动任务[' + record.taskCode + ':' + record.taskName + ']暂停执行吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const result = await setTaskJobPause(record);
        if (result && result.success) {
          reload();
        }
      },
    });
  };

  const setForceExecute = (record: Task.TaskJob) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要强制执行自动任务[' + record.taskCode + ':' + record.taskName + ']吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const result = await forceExecute(record);
        if (result && result.success) {
          reload();
        }
      },
    });
  };

  const addTask = () => {
    const task = {};
    showTaskModifyForm({
      beanMethodList,
      task,
      onOk: (curTask: Task.TaskJob) => {
        if (curTask) reload();
      },
      IsView: false,
    });
  };

  //渲染按钮
  const renderRowButton = (record: Task.TaskJob) => {
    const buttons = [];
    if (record.taskStatus == 0) {
      buttons.push(
        <a
          key="modifyTask"
          onClick={() => {
            modifyTask(record);
          }}
        >
          编辑
        </a>,
      );
    }
    if (record.taskStatus == 0) {
      buttons.push(
        <a
          key="deleteTask"
          onClick={() => {
            deleteTask(record);
          }}
        >
          删除
        </a>,
      );
    }
    if (record.taskStatus == 0) {
      buttons.push(
        <a
          key="taskJobWaiting"
          onClick={(e) => {
            taskJobWaiting(record);
          }}
        >
          等待
        </a>,
      );
    }
    if (record.taskStatus == 1) {
      buttons.push(
        <a
          key="taskJobDetail"
          onClick={(e) => {
            taskJobDetail(record);
          }}
        >
          详情
        </a>,
      );
    }
    if (record.taskStatus == 1) {
      buttons.push(
        <a
          key="taskJobPause"
          onClick={(e) => {
            taskJobPause(record);
          }}
        >
          暂停
        </a>,
      );
    }
    if (record.taskStatus == 1) {
      buttons.push(
        <a
          key="setForceExecute"
          onClick={(e) => {
            setForceExecute(record);
          }}
        >
          强制
        </a>,
      );
    }
    return buttons;
  };

  const columns: ProColumns<Task.TaskJob>[] = [
    {
      title: '任务代码',
      dataIndex: 'taskCode',
      align: 'left',
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      align: 'left',
    },
    {
      title: '调度时间',
      dataIndex: 'taskCorn',
      align: 'left',
    },
    {
      title: '上次执行时间',
      dataIndex: 'lastExeTime',
      align: 'left',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '执行结果',
      dataIndex: 'lastExeResult',
      align: 'left',
      render: (_, order) => {
        return order.lastExeResult == 0 ? '成功' : '失败';
      },
    },
    {
      title: '下次执行时间',
      dataIndex: 'nextExeTime',
      align: 'left',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '任务状态',
      dataIndex: 'taskStatus',
      valueEnum: {
        0: {
          text: '暂停',
          status: 'error',
        },
        1: {
          text: '等待',
          status: 'Success',
        },
        2: {
          text: '执行中',
          status: 'Success',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => renderRowButton(record),
    },
  ];

  const queryTaskList = async (params: any) => {
    const requestParams = { ...params };
    const result = await taskJobPageList(requestParams);
    if (result.success) {
      setTaskJobList(result.data.taskJobList);
      setBeanMethodList(result.data.beanMethodList);
      return result.data.taskJobList;
    }
    return { data: [], total: 0, success: false };
  };

  return (
    <PageContainer title={false} className={styles.modelStyles}>
      <ProTable<Task.TaskJob, API.PageParams>
        headerTitle="自动任务列表"
        defaultSize="small"
        actionRef={actionRef}
        rowKey="taskCode"
        search={{
          labelWidth: 100,
          span: 6,
          resetText: '',
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              addTask();
            }}
          >
            <PlusOutlined /> 新增任务
          </Button>,
        ]}
        request={(params) => queryTaskList(params)}
        columns={columns}
        rowSelection={false}
        pagination={{ pageSize: 10, current: 1 }}
      />
    </PageContainer>
  );
};

export default TaskList;
