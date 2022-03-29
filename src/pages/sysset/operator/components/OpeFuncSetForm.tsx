/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, Row, Col, Checkbox, message } from 'antd';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryOperatorFunctions, saveOperatorFunctions } from '@/services/sys-set';

const FormItem = Form.Item;

type OpeFuncSetFormProps = Ope.OpeFormProps & {
  funcList?: Func.FuncProps[];
  funcSelectList?: string[];
};

type OperatorFunc = Func.FuncProps & {
  opeFunction?: number;
  roleFunction?: number;
  sysRoleFunction?: number;
};

const OpeFuncSetForm: React.FC<OpeFuncSetFormProps> = (props) => {
  const [operator] = useState<Ope.OperatorItem>(props.operator ?? {});
  const [funcList, setFuncList] = useState<OperatorFunc[]>(props.funcList ?? []);
  const [selOpeFuncs, setSelOpeFuncs] = useState<string[]>(props.funcSelectList ?? []);
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    queryOperatorFunctions(props.operator).then((result) => {
      if (result && result.success) {
        if (result.data) {
          setFuncList(result.data);
          if (result.data.length > 0) {
            const funcs: OperatorFunc[] = result.data;
            const sel = funcs
              .filter((fun) => fun.opeFunction == 1)
              .map((fun) => {
                return fun.funCode;
              });
            setSelOpeFuncs(sel);
          }
        }
      }
    });
  }, [props]);
  const [form] = Form.useForm();

  const doSetOperatorFunc = () => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要更改操作员[' + operator.opeCode + ':' + operator.opeName + ']的功能定义吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        let ufs = '';
        if (selOpeFuncs && selOpeFuncs.length > 0) ufs = selOpeFuncs.join(',');
        const param = {
          opeCode: operator.opeCode,
          functions: ufs,
        };
        const result = await saveOperatorFunctions(param);
        if (result && result.success) {
          if (props.onOk) {
            message.success(result.errorMessage);
            props.onOk(operator);
          }
        }
      },
    });
  };

  const columns: ProColumns<OperatorFunc>[] = [
    {
      title: '角色',
      dataIndex: 'id',
      hideInSearch: true,
      width: '50px',
      align: 'center',
      render: (text, record) => {
        const isSys = record?.roleFunction == 1;
        return (
          <Checkbox key={'box-' + record.funCode + '-role-key'} checked={isSys} disabled={true} />
        );
      },
    },
    {
      title: '系统',
      dataIndex: 'id',
      hideInSearch: true,
      width: '50px',
      align: 'center',
      render: (text, record) => {
        const isSys = record?.sysRoleFunction == 1;
        return (
          <Checkbox key={'box-' + record.funCode + '-sys-key'} checked={isSys} disabled={true} />
        );
      },
    },
    {
      title: '功能名称',
      dataIndex: 'funName',
      align: 'left',
      hideInSearch: true,
      width: '150px',
    },
    {
      title: '功能路径',
      dataIndex: 'funPath',
      align: 'left',
      hideInSearch: true,
    },
  ];

  const onOpeFuncSelectChanged = (rows: Func.FuncProps[]) => {
    const funCodes = rows.map((row) => {
      return row.funCode ?? '';
    });
    setSelOpeFuncs(funCodes);
  };

  return (
    <Modal
      className={styles.modelStyles}
      width={720}
      bodyStyle={{ padding: '15px 15px 15px' }}
      destroyOnClose
      title={'操作员角色设置'}
      visible={props.modalVisible}
      maskClosable={props.maskClosable ?? false}
      okText={'确认'}
      cancelText={'取消'}
      onOk={(e) => {
        doSetOperatorFunc();
      }}
      onCancel={() => {
        if (props.onCancel != undefined) props.onCancel();
        else closeModal();
      }}
    >
      <Form form={form} layout="horizontal" name="operatorRoleSet">
        <Row>
          <Col span={12}>
            <FormItem label="操作员代码" name="opeCode" initialValue={operator.opeCode}>
              <Input readOnly={true} />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="操作员名称" name="opeName" initialValue={operator.opeName}>
              <Input readOnly={true} />
            </FormItem>
          </Col>
        </Row>
        <ProTable<OperatorFunc, API.PageParams>
          headerTitle="操作员功能设置列表"
          bordered
          defaultSize="small"
          actionRef={actionRef}
          rowKey="funCode"
          scroll={{ y: 300 }}
          search={false}
          toolBarRender={false}
          dataSource={funcList}
          columns={columns}
          rowSelection={{
            selectedRowKeys: selOpeFuncs,
            onChange: (_, rows) => {
              onOpeFuncSelectChanged(rows);
            },
          }}
          pagination={false}
        />
      </Form>
    </Modal>
  );
};

export default OpeFuncSetForm;

export const showOpeFuncSetForm = (props?: any) => {
  const param = {
    onOk: (operator: Ope.OperatorItem) => {
      closeModal();
    },
    modalVisible: true,
    ...props,
  };
  showModal(OpeFuncSetForm, param);
};
