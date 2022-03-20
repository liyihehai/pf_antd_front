import React, { useState, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';

const SysRoleTable: React.FC<{
  sysRoleList?: any[];
  selectedRowKeys: string[];
  onChange?: (value: string[]) => void;
}> = (props) => {
  const { sysRoleList = [] } = props;
  const [selRowKeys, setSelRowKeys] = useState<string[]>([]);

  useEffect(() => {
    const { selectedRowKeys = [] } = props;
    setSelRowKeys(selectedRowKeys);
  }, [props]);

  const onSelectedRowChanged = (selectedRows: any[]) => {
    const keys = selectedRows.map((row) => row.key);
    if (props.onChange) props.onChange(keys);
  };

  const columns: ProColumns<Role.RoleListItem>[] = [
    {
      title: '角色代码',
      dataIndex: 'key',
      align: 'left',
      search: false,
    },
    {
      title: '角色名称',
      dataIndex: 'value',
      align: 'left',
      search: false,
    },
  ];

  return (
    <ProTable
      headerTitle="系统角色列表"
      defaultSize="small"
      rowKey="key"
      columns={columns}
      dataSource={sysRoleList}
      rowSelection={{
        selectedRowKeys: selRowKeys,
        onChange: (_, selectedRows) => {
          onSelectedRowChanged(selectedRows);
        },
      }}
      options={false}
      cardProps={false}
      search={false}
      toolBarRender={false}
      pagination={{ pageSize: 5, current: 1 }}
    />
  );
};

export default SysRoleTable;
