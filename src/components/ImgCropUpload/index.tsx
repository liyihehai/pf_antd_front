import React, { useState, useEffect } from 'react';
import { Row, Col, Upload, Button, Image } from 'antd';
import { makeStaticUrl } from '@/components/Global/LocalStoreUtil';
import { BlankPicture } from '@/components/Global/data';
import { uploadFileToSrv } from '@/services/pf-basic/svrRequest';
import { UploadOutlined, ScissorOutlined, FundOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { showImageCorpForm } from '@/pages/globalForm/ImageCorpForm';

import type { FileUploadProp } from '@/services/pf-basic/svrRequest';
import { closeModal } from '../Global';

export type ImgCropUploadProp = {
  ImageWidth: number;
  Imageheight: number;
  imageSrc: string;
  imgCropProp?: any;
  IsView?: boolean;
  fuProp: FileUploadProp;
  onUploadReturnURL: (url: string) => void;
};

const ImgCropUpload: React.FC<ImgCropUploadProp> = (props) => {
  const [imageSrc, setImageSrc] = useState<string>(props.imageSrc ?? '');
  useEffect(() => {
    setImageSrc(props.imageSrc ?? '');
  }, [props.imageSrc]);

  const imageCorpProps = {
    width: 500, //裁剪宽度
    height: 300, //裁剪高度
    resize: true, //裁剪是否可以调整大小
    resizeAndDrag: true, //裁剪是否可以调整大小、可拖动
    modalTitle: '剪裁上传', //弹窗标题
    modalWidth: 650, //弹窗宽度
    ...props.imgCropProp,
  };

  const questUpload = async (options: any) => {
    let result;
    if (options.file) result = await uploadFileToSrv(props.fuProp, { ...options });
    else result = await uploadFileToSrv(props.fuProp, options);
    if (result && result.success) {
      if (!options.file) closeModal();
      props.onUploadReturnURL(result.data);
    }
  };

  return (
    <Row>
      <Col>
        <Image
          width={props.ImageWidth}
          height={props.Imageheight}
          src={makeStaticUrl(imageSrc)}
          fallback={BlankPicture}
        />
      </Col>
      <Col>
        {!props.IsView && (
          <Row>
            <Col>
              <Upload
                customRequest={(options: any) => {
                  questUpload(options);
                }}
                listType="picture"
                showUploadList={false}
                maxCount={1}
              >
                <Button shape="circle" icon={<UploadOutlined />} />
              </Upload>
            </Col>
          </Row>
        )}
        {!props.IsView && (
          <Row>
            <Col>
              <ImgCrop {...imageCorpProps}>
                <Upload
                  customRequest={(options: any) => {
                    questUpload(options);
                  }}
                  listType="picture"
                  showUploadList={false}
                  maxCount={1}
                >
                  <Button shape="circle" icon={<ScissorOutlined />} />
                </Upload>
              </ImgCrop>
            </Col>
          </Row>
        )}
        {!props.IsView && imageSrc && (
          <Row>
            <Col>
              <Button
                shape="circle"
                icon={<FundOutlined />}
                onClick={() => {
                  showImageCorpForm({
                    title: '原图剪裁上传',
                    picSrc: makeStaticUrl(imageSrc),
                    onCropOk: (blob: any) => {
                      questUpload(blob);
                    },
                  });
                }}
              />
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
};

export default ImgCropUpload;
