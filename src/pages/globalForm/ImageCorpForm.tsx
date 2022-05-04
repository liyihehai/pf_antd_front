import React, { useRef } from 'react';
import { Modal, Button } from 'antd';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { closeModal, showModal } from '@/components/Global';
import styles from '@/components/Global/global.less';
import { getFileExtension, dataURLtoFile } from '@/components/Global/fileutil';

type ImageCorpFormProp = GlobalForm.ModelProps & {
  title?: string;
  picSrc?: string;
  onCropOk: (blob: any) => void;
};
const ImageCorpForm: React.FC<ImageCorpFormProp> = (props) => {
  const cropperRef = useRef<HTMLImageElement>(null);
  const onCrop = () => {};

  const onOk = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    const fe = getFileExtension(props.picSrc ?? '');
    const dataurl = cropper.getCroppedCanvas().toDataURL();
    const fileName = 'imageFile.' + fe;
    const newFile = dataURLtoFile(dataurl, fileName);
    const formData = new FormData();
    formData.append('file', newFile);
    props.onCropOk(formData);
  };

  //const selPicture = () => {};
  //渲染底部按钮
  const renderBottomButton = () => {
    const buttons = [];
    // buttons.push(
    //   <Button key="selPicture" onClick={() => selPicture()}>
    //     选择图片
    //   </Button>,
    // );
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

  return (
    <Modal
      className={styles.modelStyles}
      width={650}
      bodyStyle={{ padding: '15px 15px 15px' }}
      destroyOnClose
      title={props.title}
      visible={props.modalVisible}
      maskClosable={props.maskClosable ?? false}
      footer={renderBottomButton()}
      onCancel={() => {
        if (props.onCancel != undefined) props.onCancel();
        else closeModal();
      }}
    >
      <div style={{ borderStyle: 'solid' }}>
        <Cropper
          src={props.picSrc}
          style={{ height: 400, width: '100%' }}
          // Cropper.js options
          initialAspectRatio={16 / 9}
          guides={true}
          crop={onCrop}
          ref={cropperRef}
          rotatable //是否旋转
        />
      </div>
    </Modal>
  );
};

export default ImageCorpForm;

export const showImageCorpForm = (props: ImageCorpFormProp) => {
  const param = {
    onOk: () => {
      closeModal();
    },
    modalVisible: true,
    ...props,
  };
  showModal(ImageCorpForm, param);
};
