import React, { useEffect, useState } from 'react';
import { Select } from 'antd';

const SearchSelect: React.FC<{
  selectList?: any[];
  allOption?: { label: string; value: string | number | undefined };
  /** Value 和 onChange 会被自动注入 */
  value?: string;
  onChange?: (value: string, option?: any) => void;
}> = (props) => {
  const { allOption, selectList } = props;
  const [innerOptions, setInnerOptions] = useState<any[]>([]);

  useEffect(() => {
    const options = [allOption].concat(
      selectList?.map((item) => {
        return { label: item.value, value: item.key };
      }),
    );
    setInnerOptions(options);
  }, [JSON.stringify(selectList)]);

  return <Select options={innerOptions} value={props.value} onChange={props.onChange} />;
};

export default SearchSelect;
