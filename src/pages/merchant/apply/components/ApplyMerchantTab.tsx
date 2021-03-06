import React, { useState, useEffect } from 'react';
import { Form, Input, Row, Col, Cascader, Button, Select, message } from 'antd';
import { cityData } from '@/components/Global/city';
import { isArray } from 'lodash';
import { queryAddressGeocode } from '@/services/pf-basic';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

type ApplyMerchantTabProp = MApplay.ApplyTabProp & {
  busiTypeList: GLOBAL.StrKeyValue[];
};

const ApplyMerchantTab: React.FC<ApplyMerchantTabProp> = (props) => {
  const form = props.form;
  const busiTypeList: GLOBAL.StrKeyValue[] = props.busiTypeList;
  const makePCA = (contentObj: MApplay.MerchantExp) => {
    if (contentObj.pmProvince && contentObj.pmCity && contentObj.pmArea) {
      return [contentObj.pmProvince, contentObj.pmCity, contentObj.pmArea];
    } else return [];
  };
  const [content, setContent] = useState<MApplay.MerchantExp>(props.content || {});
  const [pmShortName, setPmShortName] = useState<string>(content.pmShortName ?? '');
  const [pmEmail, setPmEmail] = useState<string>(content.pmEmail ?? '');
  const [pmBusiType, setPmBusiType] = useState<string>(content.pmBusiType ?? '');
  const [pmZipcode, setPmZipcode] = useState<string>(content.pmZipcode ?? '');
  const [PCA, setPCA] = useState<string[]>(makePCA(props.content));
  const [pmAddress, setPmAddress] = useState<string>(content.pmAddress ?? '');
  const [pmLinkName, setPmLinkName] = useState<string>(content.pmLinkName ?? '');
  const [pmLinkPhone, setPmLinkPhone] = useState<string>(content.pmLinkPhone ?? '');
  const [pmIntroduce, setPmIntroduce] = useState<string>(content.pmIntroduce ?? '');

  const [IsView] = useState<boolean>(props.IsView ?? false);

  useEffect(() => {
    setContent(props.content);
    setPmShortName(props.content.pmShortName ?? '');
    setPmEmail(props.content.pmEmail ?? '');
    setPmBusiType(props.content.pmBusiType ?? '');
    setPmZipcode(props.content.pmZipcode ?? '');
    setPCA(makePCA(props.content));
    setPmAddress(props.content.pmAddress ?? '');
    setPmLinkName(props.content.pmLinkName ?? '');
    setPmLinkPhone(props.content.pmLinkPhone ?? '');
    setPmIntroduce(props.content.pmIntroduce ?? '');
  }, [props.content]);

  const onInputChanged = (e: any, inputItemName: string) => {
    const newContent = { ...content };
    newContent[inputItemName] = e.target.value;
    props.onContentChanged(newContent);
  };

  const onSelectChanged = (value: any, inputItemName: string) => {
    const newContent = { ...content };
    newContent[inputItemName] = value;
    props.onContentChanged(newContent);
  };

  const onCascaderChanged = (value: any, selectedOptions: any) => {
    if (isArray(value) && value.length == 3) {
      const newContent = { ...content };
      newContent.pmProvince = value[0];
      newContent.pmCity = value[1];
      newContent.pmArea = value[2];
      const labels = selectedOptions.map((option: any) => {
        return option.label;
      });
      newContent.pmPcazh = labels[0] + '/' + labels[1] + '/' + labels[2];
      props.onContentChanged(newContent);
    }
  };

  const getAddressGeocode = async () => {
    const newContent = { ...content };
    if (!(newContent.pmProvince && newContent.pmCity && newContent.pmArea && newContent.pmPcazh)) {
      message.error('???????????????????????????');
      return;
    }
    if (!newContent.pmAddress) {
      message.error('????????????????????????');
      return;
    }
    const pcazh = newContent.pmPcazh;
    const result = await queryAddressGeocode({
      addr: pcazh.replaceAll('/', '') + newContent.pmAddress,
    });
    if (result && result.success) {
      newContent.pmLatitude = Number(result.data.lat);
      newContent.pmLongitude = Number(result.data.lng);
      props.onContentChanged(newContent);
      form.setFieldsValue({
        pmLongitude: newContent.pmLongitude,
        pmLatitude: newContent.pmLatitude,
      });
    }
  };

  return (
    <div>
      <Row>
        <Col span={12}>
          <FormItem label="????????????" name="pmShortName" initialValue={pmShortName}>
            <Input
              readOnly={IsView}
              onChange={(e: any) => {
                onInputChanged(e, 'pmShortName');
              }}
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="????????????" name="pmCode" initialValue={content.pmCode}>
            <Input readOnly={true} />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="????????????" name="pmEmail" initialValue={pmEmail}>
            <Input
              readOnly={IsView}
              onChange={(e: any) => {
                onInputChanged(e, 'pmEmail');
              }}
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            label="????????????"
            name="pmBusiType"
            rules={[{ required: true, message: '????????????!' }]}
            initialValue={pmBusiType + ''}
          >
            <Select
              onSelect={(value: any) => {
                onSelectChanged(value, 'pmBusiType');
              }}
            >
              {busiTypeList.map((item) => {
                return (
                  <Option key={item.key} value={item.key}>
                    <span>{item.value}</span>
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="???????????????" name="areas" initialValue={PCA}>
            <Cascader
              options={cityData}
              onChange={(value: any, selectedOptions: any) => {
                onCascaderChanged(value, selectedOptions);
              }}
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="????????????" name="pmZipcode" initialValue={pmZipcode}>
            <Input
              readOnly={IsView}
              onChange={(e: any) => {
                onInputChanged(e, 'pmZipcode');
              }}
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="????????????" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Input.Group compact>
              <Input
                value={pmAddress}
                readOnly={IsView}
                style={{ width: IsView ? '100%' : 'calc(100% - 105px)' }}
                onChange={(e: any) => {
                  onInputChanged(e, 'pmAddress');
                }}
              />
              {!IsView && (
                <Button
                  type="primary"
                  onClick={() => {
                    getAddressGeocode();
                  }}
                >
                  {'???????????????'}
                </Button>
              )}
            </Input.Group>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="??????" name="pmLongitude" initialValue={content.pmLongitude}>
            <Input readOnly={true} />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="??????" name="pmLatitude" initialValue={content.pmLatitude}>
            <Input readOnly={true} />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="???????????????" name="pmLinkName" initialValue={pmLinkName}>
            <Input
              readOnly={IsView}
              onChange={(e: any) => {
                onInputChanged(e, 'pmLinkName');
              }}
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="???????????????" name="pmLinkPhone" initialValue={pmLinkPhone}>
            <Input
              readOnly={IsView}
              onChange={(e: any) => {
                onInputChanged(e, 'pmLinkPhone');
              }}
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem
            label="????????????"
            name="pmIntroduce"
            initialValue={pmIntroduce}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <TextArea
              readOnly={IsView}
              showCount
              maxLength={200}
              rows={3}
              onChange={(e: any) => {
                onInputChanged(e, 'pmIntroduce');
              }}
            />
          </FormItem>
        </Col>
      </Row>
    </div>
  );
};

export default ApplyMerchantTab;
