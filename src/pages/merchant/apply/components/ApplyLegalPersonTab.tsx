import React, { useState, useEffect } from 'react';
import { Form, Input, Row, Col, Upload, Button, Image, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadImage } from '@/services/pf-basic';
import { makeStaticUrl } from '@/components/Global/LocalStoreUtil';
import { BlankPicture } from '@/components/Global/data';

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
  const src_pmCertificatePic = {
    pmCertificatePic1,
    pmCertificatePic2,
    pmCertificatePic3,
    pmCertificatePic4,
  };
  const [lsView] = useState<boolean>(props.lsView ?? false);
  const [pmCompanyPerson, setPmCompanyPerson] = useState<number>(props.pmCompanyPerson);

  useEffect(() => {
    setContent(props.content);
    setPmCertificatePic1(props.content.pmCertificatePic1);
    setPmCertificatePic2(props.content.pmCertificatePic2);
    setPmCertificatePic3(props.content.pmCertificatePic3);
    setPmCertificatePic4(props.content.pmCertificatePic4);
    setPmCompanyPerson(props.pmCompanyPerson);
  }, [props]);

  const questUpload = async (options: any, inputItemName: string) => {
    const newContent = { ...content };
    let srcFile = newContent[inputItemName];
    const srcPic = src_pmCertificatePic[inputItemName];
    let needDelSrcFile = false;
    if (srcPic == '') {
      //如果没有初始的图片文件，则需要删除被替换的原图
      needDelSrcFile = true;
    } else {
      if (srcPic != srcFile) {
        //如果有初始的图片文件，但与要替换的原图不同，也要删除被替换的原图
        needDelSrcFile = true;
      }
    }
    if (!needDelSrcFile) srcFile = '';
    const result = await uploadImage({ ...options }, { srcFile });
    if (result && result.success) {
      newContent[inputItemName] = result.data;
      props.onContentChanged(newContent);
    }
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
              readOnly={lsView}
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
              readOnly={lsView}
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
              <Image
                width={200}
                height={120}
                src={makeStaticUrl(pmCertificatePic1)}
                fallback={BlankPicture}
              />
              <Upload
                customRequest={(options: any) => {
                  questUpload(options, 'pmCertificatePic1');
                }}
                listType="picture"
                showUploadList={false}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />} />
              </Upload>
            </Card>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            label={pmCompanyPerson == 1 ? '工商登记证2' : '身份证背面'}
            name="pmCertificatePic2"
          >
            <Card bodyStyle={{ padding: '1px' }}>
              <Image
                width={200}
                height={120}
                src={makeStaticUrl(pmCertificatePic2)}
                fallback={BlankPicture}
              />
              <Upload
                customRequest={(options: any) => {
                  questUpload(options, 'pmCertificatePic2');
                }}
                listType="picture"
                showUploadList={false}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />} />
              </Upload>
            </Card>
          </FormItem>
        </Col>
      </Row>
      {pmCompanyPerson == 1 && (
        <Row>
          <Col span={12}>
            <FormItem label="税务登记证1" name="pmCertificatePic3">
              <Card bodyStyle={{ padding: '1px' }}>
                <Image
                  width={200}
                  height={120}
                  src={makeStaticUrl(pmCertificatePic3)}
                  fallback={BlankPicture}
                />
                <Upload
                  customRequest={(options: any) => {
                    questUpload(options, 'pmCertificatePic3');
                  }}
                  listType="picture"
                  showUploadList={false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />} />
                </Upload>
              </Card>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="税务登记证2" name="pmCertificatePic4">
              <Card bodyStyle={{ padding: '1px' }}>
                <Image
                  width={200}
                  height={120}
                  src={makeStaticUrl(pmCertificatePic4)}
                  fallback={BlankPicture}
                />
                <Upload
                  customRequest={(options: any) => {
                    questUpload(options, 'pmCertificatePic4');
                  }}
                  listType="picture"
                  showUploadList={false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />} />
                </Upload>
              </Card>
            </FormItem>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ApplyLegalPersonTab;
