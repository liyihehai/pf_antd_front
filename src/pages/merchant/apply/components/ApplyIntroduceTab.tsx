import React, { useState, useEffect } from 'react';
import { Form, Input, Row, Col, Upload, Button, Image, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadImage } from '@/services/pf-basic';
import { makeStaticUrl } from '@/components/Global/LocalStoreUtil';
import { BlankPicture } from '@/components/Global/data';

const FormItem = Form.Item;
const { TextArea } = Input;

const ApplyIntroduceTab: React.FC<MApplay.ApplyTabProp> = (props) => {
  const [content, setContent] = useState<MApplay.MerchantExp>(props.content || {});
  const [pmLogo, setPmLogo] = useState<string>(content.pmLogo ?? '');
  const [pmPic1, setPmPic1] = useState<string>(content.pmPic1 ?? '');
  const [pmPic2, setPmPic2] = useState<string>(content.pmPic2 ?? '');
  const [pmPic3, setPmPic3] = useState<string>(content.pmPic3 ?? '');
  const src_pmPic = { pmPic1, pmPic2, pmPic3 };
  const [pmRemark, setPmRemark] = useState<string>(content.pmRemark ?? '');

  const [lsView] = useState<boolean>(props.lsView ?? false);

  useEffect(() => {
    setContent(props.content);
    setPmLogo(props.content.pmLogo ?? '');
    setPmPic1(props.content.pmPic1 ?? '');
    setPmPic2(props.content.pmPic2 ?? '');
    setPmPic3(props.content.pmPic3 ?? '');
    setPmRemark(props.content.pmRemark ?? '');
  }, [props.content]);

  const questUpload = async (options: any, inputItemName: string) => {
    const newContent = { ...content };
    let srcFile = newContent[inputItemName];
    const srcPic = src_pmPic[inputItemName];
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
          <FormItem label="客服电话" name="pmCsrPhone" initialValue={content.pmCsrPhone}>
            <Input
              readOnly={lsView}
              onChange={(e: any) => {
                onInputChanged(e, 'pmCsrPhone');
              }}
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="商户标志" name="pmLogo">
            <Card bodyStyle={{ padding: '1px' }}>
              <Image width={72} height={72} src={makeStaticUrl(pmLogo)} fallback={BlankPicture} />
              {!lsView && (
                <Upload
                  customRequest={(options: any) => {
                    questUpload(options, 'pmLogo');
                  }}
                  listType="picture"
                  showUploadList={false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />} />
                </Upload>
              )}
            </Card>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="商户图片1" name="pmPic1">
            <Card bodyStyle={{ padding: '1px' }}>
              <Image width={200} height={120} src={makeStaticUrl(pmPic1)} fallback={BlankPicture} />
              {!lsView && (
                <Upload
                  customRequest={(options: any) => {
                    questUpload(options, 'pmPic1');
                  }}
                  listType="picture"
                  showUploadList={false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />} />
                </Upload>
              )}
            </Card>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="商户图片2" name="pmPic2">
            <Card bodyStyle={{ padding: '1px' }}>
              <Image width={200} height={120} src={makeStaticUrl(pmPic2)} fallback={BlankPicture} />
              {!lsView && (
                <Upload
                  customRequest={(options: any) => {
                    questUpload(options, 'pmPic2');
                  }}
                  listType="picture"
                  showUploadList={false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />} />
                </Upload>
              )}
            </Card>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="商户图片3" name="pmPic3">
            <Card bodyStyle={{ padding: '1px' }}>
              <Image width={200} height={120} src={makeStaticUrl(pmPic3)} fallback={BlankPicture} />
              {!lsView && (
                <Upload
                  customRequest={(options: any) => {
                    questUpload(options, 'pmPic3');
                  }}
                  listType="picture"
                  showUploadList={false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />} />
                </Upload>
              )}
            </Card>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="商户备注" name="pmRemark" initialValue={pmRemark}>
            <TextArea
              readOnly={lsView}
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
