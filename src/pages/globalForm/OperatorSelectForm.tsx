/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, message } from 'antd';
import { showModal, closeModal } from '@/components/Global';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import styles from '@/components/Global/global.less';
import { loadSelectOperator } from '@/services/global-select';

const OperatorSelectForm: React.FC<GlobalForm.SelProps> = (props) => {
  const selModel = props.selModel;
  const [operatorList, setOperatorList] = useState<Ope.OperatorItem[]>([]);
  const [selOperatorList, setSelOperatorList] = useState<Ope.OperatorItem[]>([]);
  const [selOpeCodes, setSelOpeCodes] = useState<string[]>([]);
  const actionRef = useRef<ActionType>();

  const loadSelectOperators = async () => {
    const result = await loadSelectOperator({});
    if (result && result.success) {
      setOperatorList(result.data);
    }
  };

  useEffect(() => {
    loadSelectOperators();
  }, [props]);

  const onOk = async () => {
    try {
      if (!selOperatorList || selOperatorList.length <= 0) {
        message.error('没有选择任何一个操作员');
        return;
      }
      if (selModel == 'single' && props.onSelected) {
        props.onSelected(selOperatorList[0]);
        return;
      }
      if (selModel == 'multiple' && props.onSelected) {
        props.onSelected(selOperatorList);
        return;
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
    buttons.push(
      <Button
        type="primary"
        key="btnSelected"
        onClick={(e) => {
          e.preventDefault();
          onOk();
        }}
        style={{ marginLeft: 20 }}
      >
        确定
      </Button>,
    );
    return buttons;
  };

  const onOperatorSelectChanged = (rows: Ope.OperatorItem[]) => {
    const opeCodes = rows.map((row) => {
      return row.opeCode ?? '';
    });
    setSelOpeCodes(opeCodes);
    setSelOperatorList(rows);
  };

  const columns: ProColumns<Ope.OperatorItem>[] = [
    {
      title: '操作员代码',
      dataIndex: 'opeCode',
      align: 'left',
      hideInSearch: true,
    },
    {
      title: '操作员名称',
      dataIndex: 'opeName',
      align: 'left',
      hideInSearch: true,
    },
  ];

  return (
    <Modal
      className={styles.modelStyles}
      width={500}
      bodyStyle={{ padding: '15px 15px 15px' }}
      destroyOnClose
      title={'选择操作员'}
      visible={props.modalVisible}
      maskClosable={props.maskClosable ?? false}
      footer={renderBottomButton()}
      onCancel={() => {
        if (props.onCancel != undefined) props.onCancel();
        else closeModal();
      }}
    >
      <ProTable<Ope.OperatorItem, API.PageParams>
        headerTitle="操作员角色设置列表"
        bordered
        defaultSize="small"
        actionRef={actionRef}
        rowKey="opeCode"
        scroll={{ y: 300 }}
        search={false}
        toolBarRender={false}
        dataSource={operatorList}
        columns={columns}
        rowSelection={{
          alwaysShowAlert: false,
          type: selModel == 'single' ? 'radio' : 'checkbox',
          selectedRowKeys: selOpeCodes,
          onChange: (_, rows) => {
            onOperatorSelectChanged(rows);
          },
        }}
        pagination={false}
      />
    </Modal>
  );
};

export default OperatorSelectForm;

export const showOperatorSelectForm = (props?: GlobalForm.SelProps) => {
  const param = {
    onSelected: (operator: Ope.OperatorItem | Ope.OperatorItem[]) => {
      closeModal();
    },
    modalVisible: true,
    ...props,
  };
  showModal(OperatorSelectForm, param);
};
