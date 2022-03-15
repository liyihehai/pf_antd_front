import React, { useEffect, useState } from 'react';
import { Select } from 'antd';

const SysRoleSelect: React.FC<{
  sysRoleList?: any[];
  allOption?: { label: string; value: string | number | undefined };
  /** Value 和 onChange 会被自动注入 */
  value?: string;
  onChange?: (value: string) => void;
}> = (props) => {
  const { allOption, sysRoleList } = props;
  const [innerOptions, setInnerOptions] = useState<any[]>([]);

  useEffect(() => {
    const options = [allOption].concat(
      sysRoleList?.map((item) => {
        return { label: item.value, value: item.key };
      }),
    );
    setInnerOptions(options);
  }, [JSON.stringify(sysRoleList)]);

  return <Select options={innerOptions} value={props.value} onChange={props.onChange} />;
};

export default SysRoleSelect;
