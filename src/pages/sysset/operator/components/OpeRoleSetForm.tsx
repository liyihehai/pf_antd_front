/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, Row, Col } from 'antd';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryOperatorRoles, saveOperatorRoles } from '@/services/sys-set';

const FormItem = Form.Item;

export type OpeRoleSetFormProps = Ope.OpeFormProps & {
  roleList?: Role.RoleListItem[];
  roleSelectList?: string[];
};

const OpeRoleSetForm: React.FC<OpeRoleSetFormProps> = (props) => {
  const [operator] = useState<Ope.OperatorItem>(props.operator ?? {});
  const [roleList, setRoleList] = useState<Role.RoleListItem[]>(props.roleList ?? []);
  const [selOpeRoles, setSelOpeRoles] = useState<string[]>(props.roleSelectList ?? []);
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    queryOperatorRoles(props.operator).then((result) => {
      if (result && result.success) {
        setRoleList(result.data.roles);
        if (result.data.opeRoles) {
          if (result.data.opeRoles.length > 0) {
            const roleCodes = result.data.opeRoles.map((role: any) => {
              return role.key;
            });
            setSelOpeRoles(roleCodes);
          }
        }
      }
    });
  }, [props]);
  const [form] = Form.useForm();
  const doSetOperatorRole = () => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要更改操作员[' + operator.opeCode + ':' + operator.opeName + ']的角色定义吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        let urs = '';
        if (selOpeRoles && selOpeRoles.length > 0) urs = selOpeRoles.join(',');
        const param = {
          opeCode: operator.opeCode,
          userRoles: urs,
        };
        const result = await saveOperatorRoles(param);
        if (result && result.success) {
          if (props.onOk) {
            props.onOk(operator);
          }
        }
      },
    });
  };

  const onOpeRoleSelectChanged = (rows: Role.RoleListItem[]) => {
    const roleCodes = rows.map((row) => {
      return row.roleCode ?? '';
    });
    setSelOpeRoles(roleCodes);
  };

  const columns: ProColumns<Role.RoleListItem>[] = [
    {
      title: '角色代码',
      dataIndex: 'roleCode',
      align: 'left',
      hideInSearch: true,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      align: 'left',
      hideInSearch: true,
    },
  ];
  return (
    <Modal
      className={styles.modelStyles}
      width={640}
      bodyStyle={{ padding: '15px 15px 15px' }}
      destroyOnClose
      title={'操作员角色设置'}
      visible={props.modalVisible}
      maskClosable={props.maskClosable ?? false}
      okText={'确认'}
      cancelText={'取消'}
      onOk={(e) => {
        doSetOperatorRole();
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
        <ProTable<Role.RoleListItem, API.PageParams>
          headerTitle="操作员角色设置列表"
          bordered
          defaultSize="small"
          actionRef={actionRef}
          rowKey="roleCode"
          scroll={{ y: 300 }}
          search={false}
          toolBarRender={false}
          dataSource={roleList}
          columns={columns}
          rowSelection={{
            selectedRowKeys: selOpeRoles,
            onChange: (_, rows) => {
              onOpeRoleSelectChanged(rows);
            },
          }}
          pagination={false}
        />
      </Form>
    </Modal>
  );
};

export default OpeRoleSetForm;

export const showOpeRoleSetForm = (props?: any) => {
  const param = {
    onOk: (operator: Ope.OperatorItem) => {
      closeModal();
    },
    modalVisible: true,
    ...props,
  };
  showModal(OpeRoleSetForm, param);
};
