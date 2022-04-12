declare namespace Libr {
  type LibItem = {
    id?: number;
    libTypeCode?: string;
    libTypeName?: string;
    typeItemCode?: string;
    typeItemName?: string;
    itemSort?: number;
    itemState?: number;
    appCode?: string;
    modelCode?: string;
    canModify?: number;
    remark?: string;
    createBy?: string;
    createDate?: string;
    updateBy?: string;
    updateDate?: string;
  };
  type LibFormProps = {
    onCancel?: (flag?: boolean, formVals?: Libr.LibItem) => void;
    onOk?: (values: Libr.LibItem) => Promise<void>;
    modalVisible?: boolean;
    libItem: Libr.LibItem;
    maskClosable?: boolean;
  };
}
