import React, { useState, useEffect } from 'react';
import { Form, Input, Row, Col, Card } from 'antd';
import ImgCropUpload from '@/components/ImgCropUpload';
import { fuProp } from '../MerchantData';

const FormItem = Form.Item;
type LegalPersonTabProp = MApplay.ApplyTabProp & {
  pmCompanyPerson: number;
};

const ApplyLegalPersonTab: React.FC<LegalPersonTabProp> = (props) => {
  const [content, setContent] = useState<MApplay.MerchantExp>(props.content || {});
  const [pmCertificatePic1, setPmCertificatePic1] = useState<string>(
    content.pmCertificatePic1 ?? '',
  );
  const [pmCertificatePic2, setPmCertificatePic2] = useState<string>(
    content.pmCertificatePic2 ?? '',
  );
  const [pmCertificatePic3, setPmCertificatePic3] = useState<string>(
    content.pmCertificatePic3 ?? '',
  );
  const [pmCertificatePic4, setPmCertificatePic4] = useState<string>(
    content.pmCertificatePic4 ?? '',
  );
  const [IsView] = useState<boolean>(props.IsView ?? false);
  const [pmCompanyPerson, setPmCompanyPerson] = useState<number>(props.pmCompanyPerson);

  useEffect(() => {
    setContent(props.content);
    setPmCertificatePic1(props.content.pmCertificatePic1 ?? '');
    setPmCertificatePic2(props.content.pmCertificatePic2 ?? '');
    setPmCertificatePic3(props.content.pmCertificatePic3 ?? '');
    setPmCertificatePic4(props.content.pmCertificatePic4 ?? '');
    setPmCompanyPerson(props.pmCompanyPerson);
  }, [props]);

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
          <FormItem
            label={pmCompanyPerson == 1 ? '法人姓名' : '个人姓名'}
            name="pmLegalName"
            initialValue={content.pmLegalName}
          >
            <Input
              readOnly={IsView}
              onChange={(e: any) => {
                onInputChanged(e, 'pmLegalName');
              }}
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            label={pmCompanyPerson == 1 ? '工商登记号' : '身份证号'}
            name="pmLegalIdNum"
            initialValue={content.pmLegalIdNum}
          >
            <Input
              readOnly={IsView}
              onChange={(e: any) => {
                onInputChanged(e, 'pmLegalIdNum');
              }}
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem
            label={pmCompanyPerson == 1 ? '工商登记证1' : '身份证正面'}
            name="pmCertificatePic1"
          >
            <Card bodyStyle={{ padding: '1px' }}>
              <ImgCropUpload
                ImageWidth={200}
                Imageheight={120}
                imageSrc={pmCertificatePic1}
                fuProp={fuProp}
                IsView={IsView}
                onUploadReturnURL={(url) => {
                  questUpload(url, 'pmCertificatePic1');
                }}
              />
            </Card>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            label={pmCompanyPerson == 1 ? '工商登记证2' : '身份证背面'}
            name="pmCertificatePic2"
          >
            <Card bodyStyle={{ padding: '1px' }}>
              <ImgCropUpload
                ImageWidth={200}
                Imageheight={120}
                imageSrc={pmCertificatePic2}
                fuProp={fuProp}
                IsView={IsView}
                onUploadReturnURL={(url) => {
                  questUpload(url, 'pmCertificatePic2');
                }}
              />
            </Card>
          </FormItem>
        </Col>
      </Row>
      {pmCompanyPerson == 1 && (
        <Row>
          <Col span={12}>
            <FormItem label="税务登记证1" name="pmCertificatePic3">
              <Card bodyStyle={{ padding: '1px' }}>
                <ImgCropUpload
                  ImageWidth={200}
                  Imageheight={120}
                  imageSrc={pmCertificatePic3}
                  fuProp={fuProp}
                  IsView={IsView}
                  onUploadReturnURL={(url) => {
                    questUpload(url, 'pmCertificatePic3');
                  }}
                />
              </Card>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="税务登记证2" name="pmCertificatePic4">
              <Card bodyStyle={{ padding: '1px' }}>
                <ImgCropUpload
                  ImageWidth={200}
                  Imageheight={120}
                  imageSrc={pmCertificatePic4}
                  fuProp={fuProp}
                  IsView={IsView}
                  onUploadReturnURL={(url) => {
                    questUpload(url, 'pmCertificatePic4');
                  }}
                />
              </Card>
            </FormItem>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ApplyLegalPersonTab;
