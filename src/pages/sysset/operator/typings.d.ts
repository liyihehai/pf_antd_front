declare namespace Ope {
  type OperatorItem = {
    id?: number;
    opeType?: number;
    opeCode?: string;
    opeName?: string;
    opePassword?: string;
    opeMobile?: string;
    opeState?: number;
    createTime?: string;
    tmpKey?: string;
  };

  type OpeFormProps = {
    onCancel?: (flag?: boolean, formVals?: Ope.OperatorItem) => void;
    onOk?: (values: Ope.OperatorItem) => Promise<void>;
    modalVisible?: boolean;
    operator: Ope.OperatorItem;
    maskClosable?: boolean;
  };
}
