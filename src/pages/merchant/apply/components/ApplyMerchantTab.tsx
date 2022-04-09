import React, { useState, useEffect } from 'react';
import { Form, Input, Row, Col, Cascader, Button, Select, message } from 'antd';
import { cityData } from '@/components/Global/city';
import { isArray } from 'lodash';
import { queryAddressGeocode } from '@/services/pf-basic';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

const ApplyMerchantTab: React.FC<MApplay.ApplyTabProp> = (props) => {
  const form = props.form;

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

  const [lsView] = useState<boolean>(props.lsView ?? false);

  useEffect(() => {
    setContent(props.content);
    setPmShortName(props.content.pmShortName);
    setPmEmail(props.content.pmEmail);
    setPmBusiType(props.content.pmBusiType);
    setPmZipcode(props.content.pmZipcode);
    setPCA(makePCA(props.content));
    setPmAddress(props.content.pmAddress);
    setPmLinkName(props.content.pmLinkName);
    setPmLinkPhone(props.content.pmLinkPhone);
    setPmIntroduce(props.content.pmIntroduce);
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
      newContent.pmPCAzh = labels[0] + '/' + labels[1] + '/' + labels[2];
      props.onContentChanged(newContent);
    }
  };

  const getAddressGeocode = async () => {
    const newContent = { ...content };
    if (!(newContent.pmProvince && newContent.pmCity && newContent.pmArea && newContent.pmPCAzh)) {
      message.error('请先确定省市及区县');
      return;
    }
    if (!newContent.pmAddress) {
      message.error('请先输入详细地址');
      return;
    }
    const pcazh = newContent.pmPCAzh;
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
          <FormItem label="商户简称" name="pmShortName" initialValue={pmShortName}>
            <Input
              readOnly={lsView}
              onChange={(e: any) => {
                onInputChanged(e, 'pmShortName');
              }}
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="商户代码" name="pmCode" initialValue={content.pmCode}>
            <Input readOnly={true} />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="电子邮箱" name="pmEmail" initialValue={pmEmail}>
            <Input
              readOnly={lsView}
              onChange={(e: any) => {
                onInputChanged(e, 'pmEmail');
              }}
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            label="行业分类"
            name="pmBusiType"
            rules={[{ required: true, message: '行业分类!' }]}
            initialValue={pmBusiType + ''}
          >
            <Select
              onSelect={(value: any) => {
                onSelectChanged(value, 'pmBusiType');
              }}
            >
              <Option key={'1'}>
                <span>{'操作员申请'}</span>
              </Option>
              <Option key={'2'}>
                <span>{'网站自助申请'}</span>
              </Option>
              <Option key={'3'}>
                <span>{'APP自助申请'}</span>
              </Option>
              <Option key={'4'}>
                <span>{'业务员申请'}</span>
              </Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="省市及区县" name="areas" initialValue={PCA}>
            <Cascader
              options={cityData}
              onChange={(value: any, selectedOptions: any) => {
                onCascaderChanged(value, selectedOptions);
              }}
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="邮政编码" name="pmZipcode" initialValue={pmZipcode}>
            <Input
              readOnly={lsView}
              onChange={(e: any) => {
                onInputChanged(e, 'pmZipcode');
              }}
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem
            label="详细地址"
            name="pmAddress"
            initialValue={pmAddress}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Input.Group compact>
              <Input
                readOnly={lsView}
                style={{ width: 'calc(100% - 105px)' }}
                onChange={(e: any) => {
                  onInputChanged(e, 'pmAddress');
                }}
              />
              <Button
                type="primary"
                onClick={() => {
                  getAddressGeocode();
                }}
              >
                {'获取经纬度'}
              </Button>
            </Input.Group>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="经度" name="pmLongitude" initialValue={content.pmLongitude}>
            <Input readOnly={true} />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="纬度" name="pmLatitude" initialValue={content.pmLatitude}>
            <Input readOnly={true} />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="联系人姓名" name="pmLinkName" initialValue={pmLinkName}>
            <Input
              readOnly={lsView}
              onChange={(e: any) => {
                onInputChanged(e, 'pmLinkName');
              }}
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="联系人电话" name="pmLinkPhone" initialValue={pmLinkPhone}>
            <Input
              readOnly={lsView}
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
            label="商户简介"
            name="pmIntroduce"
            initialValue={pmIntroduce}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <TextArea
              readOnly={lsView}
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
