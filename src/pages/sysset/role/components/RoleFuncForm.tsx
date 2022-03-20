/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Modal, Form, Input, Row, Col, Checkbox, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';
import { queryRoleFunctions, saveRoleFunctions } from '@/services/sys-set';
import SvgIcon from '@/components/SvgIcon';

const FormItem = Form.Item;

export type RoleFuncFormProps = {
  onCancel?: (flag?: boolean, formVals?: Role.RoleListItem) => void;
  onSaveSuc?: (values: Role.RoleListItem) => Promise<void>;
  notifyRoleChanged?: (role: Role.RoleListItem) => void;
  functionList: Func.FuncProps[];
  selFunPaths?: string[];
  selFunCodes?: string[];
  sysRolePaths?: string[];
  modalVisible?: boolean;
  role: Role.RoleListItem;
  maskClosable?: boolean;
};

const RoleFuncForm: React.FC<RoleFuncFormProps> = (props) => {
  const { functionList = [] } = props;
  const [role] = useState<Role.RoleListItem>(props.role || {});
  const [selFunPaths, setSelFunPaths] = useState<string[]>(props.selFunPaths ?? []);
  const [selFunCodes, setSelFunCodes] = useState<string[]>(props.selFunCodes ?? []);
  const [sysRolePaths] = useState<string[]>(props.sysRolePaths ?? []);

  const onFuncSelectChanged = (values: Func.FuncProps[]) => {
    const funCodes = values.map((func) => {
      return func.funCode ?? '';
    });
    setSelFunCodes(funCodes);
    setSelFunPaths(
      values.map((func) => {
        return func.funPath ?? '';
      }),
    );
  };

  const [form] = Form.useForm();
  const onOk = async () => {
    try {
      let functions = '';
      if (selFunCodes.length > 0) {
        functions = selFunCodes.join(',');
      }
      const updateRole = { ...role, functions: functions };
      const result = await saveRoleFunctions(updateRole);
      if (result.success && props.onSaveSuc) props.onSaveSuc(updateRole);
    } catch (errorInfo) {}
  };

  const columns: ProColumns<Func.FuncProps>[] = [
    {
      title: '功能路径',
      dataIndex: 'funPath',
      search: false,
      hideInTable: true,
    },
    {
      title: '图标',
      dataIndex: 'funIcon',
      search: false,
      align: 'center',
      render: (text, record) => <SvgIcon type={record.funIcon ?? ''} />,
    },
    {
      title: '系统',
      dataIndex: 'funPath',
      search: false,
      align: 'center',
      render: (text, record) => {
        let isSys = false;
        if (sysRolePaths && sysRolePaths.length > 0) {
          isSys = sysRolePaths.some((value) => {
            return value == text;
          });
        }
        return <Checkbox key={'box-' + record.funCode + '-key'} checked={isSys} disabled={true} />;
      },
    },
    {
      title: '功能代码',
      dataIndex: 'funCode',
      align: 'left',
      search: false,
    },
    {
      title: '功能名称',
      dataIndex: 'funName',
      align: 'left',
      search: false,
    },
  ];

  return (
    <Modal
      className={styles.modelStyles}
      width={750}
      bodyStyle={{ padding: '15px 15px 15px' }}
      destroyOnClose
      title={'角色功能'}
      visible={props.modalVisible}
      maskClosable={props.maskClosable ?? false}
      okText={'确认'}
      cancelText={'取消'}
      onOk={(e) => {
        onOk();
      }}
      onCancel={() => {
        if (props.onCancel) props.onCancel();
        else closeModal();
      }}
    >
      <Form form={form} layout="horizontal" name="roleModify">
        <Row>
          <Col span={12}>
            <FormItem label="角色代码" name="roleCode" initialValue={role.roleCode}>
              <Input readOnly={true} />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="角色名称" name="roleName" initialValue={role.roleName}>
              <Input readOnly={true} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ProTable
              defaultSize="small"
              rowKey="funPath"
              columns={columns}
              dataSource={functionList}
              rowSelection={{
                selectedRowKeys: selFunPaths,
                onChange: (_, selectedRows) => {
                  onFuncSelectChanged(selectedRows);
                },
              }}
              options={false}
              cardProps={false}
              search={false}
              toolBarRender={false}
              pagination={{ pageSize: 5, current: 1 }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default RoleFuncForm;

export const showRoleFuncForm = async (props: RoleFuncFormProps) => {
  const { role, functionList } = props;
  if (functionList.length <= 0) {
    message.info('系统尚未设置任何可操作的功能！');
    return;
  }
  const result = await queryRoleFunctions(role);
  if (!result.success) return;

  let selFunPaths = [],
    selFunCodes = [],
    sysRolePaths = [];
  if (result.data && result.data.length > 0) {
    selFunPaths = result.data
      .filter((roleFunc: any) => {
        return roleFunc.roleFunction == 1;
      })
      .map((roleFunc: any) => roleFunc.funPath);

    selFunCodes = result.data
      .filter((roleFunc: any) => {
        return roleFunc.roleFunction == 1;
      })
      .map((roleFunc: any) => roleFunc.funCode);

    sysRolePaths = result.data
      .filter((roleFunc: any) => {
        return roleFunc.sysRoleFunction == 1;
      })
      .map((roleFunc: any) => roleFunc.funPath);
  }

  const param = {
    onSaveSuc: (updateRole: Role.RoleListItem) => {
      if (props.notifyRoleChanged) {
        props.notifyRoleChanged(updateRole);
      }
      closeModal();
    },
    ...props,
    modalVisible: true,
    role,
    functionList,
    selFunPaths,
    selFunCodes,
    sysRolePaths,
  };
  showModal(RoleFuncForm, param);
};
