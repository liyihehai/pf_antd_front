import React, { useState, useEffect } from 'react';
import { Form, Input, Row, Col, Card } from 'antd';
import ImgCropUpload from '@/components/ImgCropUpload';
import { fuProp } from '../MerchantData';

const FormItem = Form.Item;
const { TextArea } = Input;

const ApplyIntroduceTab: React.FC<MApplay.ApplyTabProp> = (props) => {
  const [content, setContent] = useState<MApplay.MerchantExp>(props.content || {});
  const [pmLogo, setPmLogo] = useState<string>(content.pmLogo ?? '');
  const [pmPic1, setPmPic1] = useState<string>(content.pmPic1 ?? '');
  const [pmPic2, setPmPic2] = useState<string>(content.pmPic2 ?? '');
  const [pmPic3, setPmPic3] = useState<string>(content.pmPic3 ?? '');
  const [pmRemark, setPmRemark] = useState<string>(content.pmRemark ?? '');

  const [IsView] = useState<boolean>(props.IsView ?? false);

  useEffect(() => {
    setContent(props.content);
    setPmLogo(props.content.pmLogo ?? '');
    setPmPic1(props.content.pmPic1 ?? '');
    setPmPic2(props.content.pmPic2 ?? '');
    setPmPic3(props.content.pmPic3 ?? '');
    setPmRemark(props.content.pmRemark ?? '');
  }, [props.content]);

  const questUpload = async (url: string, inputItemName: string) => {
    const newContent = { ...content };
    newContent[inputItemName] = url;
    props.onContentChanged(newContent);
  };

  const onInputChanged = (e: any, inputItemName: string) => {
    const newContent = { ...content };
    newContent[inputItemName] = e.target.value;
    props.onContentChanged(newContent);
  };

  return (
    <div>
      <Row>
        <Col span={12}>
          <FormItem label="客服电话" name="pmCsrPhone" initialValue={content.pmCsrPhone}>
            <Input
              readOnly={IsView}
              onChange={(e: any) => {
                onInputChanged(e, 'pmCsrPhone');
              }}
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="商户标志" name="pmLogo">
            <Card bodyStyle={{ padding: '1px' }}>
              <ImgCropUpload
                ImageWidth={72}
                Imageheight={72}
                imageSrc={pmLogo}
                fuProp={fuProp}
                IsView={IsView}
                onUploadReturnURL={(url) => {
                  questUpload(url, 'pmLogo');
                }}
              />
            </Card>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="商户图片1" name="pmPic1">
            <Card bodyStyle={{ padding: '1px' }}>
              <ImgCropUpload
                ImageWidth={200}
                Imageheight={120}
                imageSrc={pmPic1}
                fuProp={fuProp}
                IsView={IsView}
                onUploadReturnURL={(url) => {
                  questUpload(url, 'pmPic1');
                }}
              />
            </Card>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="商户图片2" name="pmPic2">
            <Card bodyStyle={{ padding: '1px' }}>
              <ImgCropUpload
                ImageWidth={200}
                Imageheight={120}
                imageSrc={pmPic2}
                fuProp={fuProp}
                IsView={IsView}
                onUploadReturnURL={(url) => {
                  questUpload(url, 'pmPic2');
                }}
              />
            </Card>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="商户图片3" name="pmPic3">
            <Card bodyStyle={{ padding: '1px' }}>
              <ImgCropUpload
                ImageWidth={200}
                Imageheight={120}
                imageSrc={pmPic3}
                fuProp={fuProp}
                IsView={IsView}
                onUploadReturnURL={(url) => {
                  questUpload(url, 'pmPic3');
                }}
              />
            </Card>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="商户备注" name="pmRemark" initialValue={pmRemark}>
            <TextArea
              readOnly={IsView}
              showCount
              maxLength={100}
              rows={4}
              onChange={(e: any) => {
                onInputChanged(e, 'pmRemark');
              }}
            />
          </FormItem>
        </Col>
      </Row>
    </div>
  );
};
export default ApplyIntroduceTab;
