declare namespace GlobalForm {
  type ModelProps = {
    onCancel?: () => void;
    modalVisible?: boolean;
    maskClosable?: boolean;
  };
  type MVFormProps = ModelProps & {
    IsView: boolean;
  };
  type SelProps = ModelProps & {
    onSelected?: (selItems: any | any[]) => void;
    selModel: 'single' | 'multiple';
  };
  type TitleAreaTextResult = {
    keyValue?: any;
    textValue?: string;
  };
  type TitleAreaTextProps = ModelProps & {
    title?: string;
    keyValue?: any;
    keyLabel?: string;
    keyName?: string;
    textLabel: string;
    textValue?: string;
    maxLength?: number;
    onConfirm?: (result: TitleAreaTextResult) => void;
  };
}
