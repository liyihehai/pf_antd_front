/* eslint-disable @typescript-eslint/consistent-type-imports */
import React, { useState, useEffect } from 'react';
import {
    Modal, Form, Input, Button, Select, DatePicker,
    Row, Col, List, Card, message, Tag, Checkbox
} from 'antd';
import { LaptopOutlined } from '@ant-design/icons';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';
import { saveMerchantLicense, getUtiAccountByMerchantCode, resetLicenseTerminal } from '@/services/merchant';
import { showMerchantSelectForm } from '@/pages/globalForm/MerchantSelectForm';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { string2Date, monthAdd, date2String } from '@/components/Global/dateutil';
import licenseStyle from '../../setting/css/index.less';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

const FormItem = Form.Item;
const Option = Select.Option;
const { Search } = Input;

type LFormProp = GLOBAL.FormProps & {
    license: License.AppLicense;
    IsView: boolean;
    busiAppList: GLOBAL.StrKeyValue[];
    busiModuleList: GLOBAL.StrKeyValue[];
};
const LicenseModifyForm: React.FC<LFormProp> = (props) => {
    const busiAppList: GLOBAL.StrKeyValue[] = props.busiAppList;
    const busiModuleList: GLOBAL.StrKeyValue[] = props.busiModuleList;
    const license: License.AppLicense = props.license;
    const [IsView] = useState<boolean>(props.IsView ?? false);
    const [terminalList, setTerminalList] = useState<string[]>(license.terminals?.split(',') ?? []);
    const [merchantTerminals, setMerchantTerminals] = useState<string>(license.merchantTerminals ?? '[]');
    const [merhcantTerminalList, setMerhcantTerminalList] = useState<MerSetting.Terminal[]>(JSON.parse(merchantTerminals) ?? []);
    const [terminalSelList, setTerminalSelList] = useState<boolean[]>([]);

    const [form] = Form.useForm();

    const onMerchantChanged = () => {
        const list = [];
        const selList = [];
        for (let i = 0; i < merhcantTerminalList.length; i++) {
            const merchantTerminal = merhcantTerminalList[i];
            selList[i] = false;
            for (let m = 0; m < terminalList.length; m++) {
                if (terminalList[m] == merchantTerminal.term) {
                    selList[i] = true;
                    list[list.length] = merchantTerminal.term;
                    break;
                }
            }
        }
        setTerminalSelList(selList);
        setTerminalList(list);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        onTerminalCountChanged(list);
    }
    useEffect(() => {
        onMerchantChanged();
    }, [props]);

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const save = {
                ...license,
                ...values,
            };
            if (license.copyCount <= 0) {
                message.error("???????????????????????? ");
                return;
            }
            const result = await saveMerchantLicense(save);
            if (result.success && props.onOk) {
                props.onOk(result.data);
            }
        } catch (errorInfo) { }
    };

    const onSearchMerchant = () => {
        showMerchantSelectForm({
            onSelected: async (selItems: any | any[]) => {
                const selMerchant: MerSetting.MerchantItem = selItems;
                const result = await getUtiAccountByMerchantCode(selMerchant);
                if (result && result.success && result.data) {
                    license.pmCode = selMerchant.pmCode ?? '';
                    license.pmName = selMerchant.pmName ?? '';
                    license.pmShortName = selMerchant.pmShortName ?? '';
                    license.merchantTerminals = result.data.terminals;
                    setMerchantTerminals(license.merchantTerminals);
                    setMerhcantTerminalList(JSON.parse(license.merchantTerminals));
                    onMerchantChanged();
                    form.setFieldsValue({ pmName: license.pmName });
                    closeModal();
                } else {
                    message.error('??????????????????UTI??????');
                }
            },
            selModel: 'single',
        });
    }

    const onStartDateChanged = (values: any, dateString: string) => {
        license.startDate = dateString;
        license.endDate = date2String(monthAdd(string2Date(license.startDate), license.monthCount), 'YYYY/MM/DD');
        form.setFieldsValue({ endDate: moment(license.endDate, 'YYYY/MM/DD') });
    }

    const onMonthCountChanged = (e: any) => {
        license.monthCount = Number(e);
        license.endDate = date2String(monthAdd(string2Date(license.startDate), license.monthCount), 'YYYY/MM/DD');
        form.setFieldsValue({ endDate: moment(license.endDate, 'YYYY/MM/DD') });
    }

    const onTerminalCountChanged = (termList: string[]) => {
        license.copyCount = termList.length;
        if (termList.length <= 0)
            license.terminals = '';
        else
            license.terminals = termList.join(',');
        form.setFieldsValue({ copyCount: license.copyCount });
    }

    const onCopyTerminal = () => {
        const $temp = document.createElement('input');
        document.body.append($temp);
        $temp.value = license.terminals;
        $temp.select();
        window.document.execCommand('copy');
        $temp.remove();
        message.success('?????????????????????????????????');
    }

    const onAddTerminal = (item: string, index: number) => {
        const list = [...terminalList];
        let isExist: boolean = false;
        for (let i = 0; i < terminalList.length; i++) {
            if (list[i] == item) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            list[list.length] = item;
            setTerminalList(list);
            onTerminalCountChanged(list);
        }
        const selList: boolean[] = [...terminalSelList];
        selList[index] = true;
        setTerminalSelList(selList);
    }

    const onDeleteTerminal = (item: string, index: number) => {
        const list = [...terminalList];
        for (let i = 0; i < terminalList.length; i++) {
            if (list[i] == item) {
                list.splice(i, 1);
            }
        }
        setTerminalList(list);
        onTerminalCountChanged(list);
        const selList: boolean[] = [...terminalSelList];
        selList[index] = false;
        setTerminalSelList(selList);
    }

    const onTerminalChanged = (e: CheckboxChangeEvent, item: MerSetting.Terminal, index: number) => {
        if (e.target.checked) {
            onAddTerminal(item.term, index);
        } else {
            onDeleteTerminal(item.term, index);
        }
    }

    const resetTerminals = () => {
        Modal.confirm({
            title: '????????????',
            content: '???????????????????????????????????????????????????????????????????????????????????????????!',
            cancelText: '??????',
            okText: '??????',
            onOk: async () => {
                const l = {
                    id: license.id,
                    terminals: license.terminals,
                }
                const result = await resetLicenseTerminal(l);
                if (result && result.success) {
                    message.success(result.errorMessage);
                }
            },
        });
    }

    //??????????????????
    const renderBottomButton = () => {
        const buttons = [];
        if (IsView) {
            buttons.push(
                <Button
                    key='resetTerminals'
                    type="default"
                    onClick={() => {
                        resetTerminals();
                    }}
                >????????????</Button>
            );
        }
        buttons.push(
            <Button
                key='onCopyTerminal'
                type="default"
                onClick={() => {
                    onCopyTerminal();
                }}
            >????????????</Button>
        );
        buttons.push(
            <Button key="btnClose" onClick={() => closeModal()}>
                ??????
            </Button>,
        );
        if (!IsView) {
            buttons.push(
                <Button
                    type="primary"
                    key="btnSave"
                    onClick={(e) => {
                        e.preventDefault();
                        onOk();
                    }}
                    style={{ marginLeft: 20 }}
                >
                    ??????
                </Button>,
            );
        }
        return buttons;
    };

    //?????????????????????
    const disabledDate = (current: any) => {
        // ???????????????????????????
        return current < moment().subtract(1, 'day');
    }

    const title = '????????????-[' + ((license.feeType == 1) ? '??????' : '??????') + ']';

    return (
        <Modal
            className={styles.modelStyles}
            width={820}
            bodyStyle={{ padding: '15px 15px 15px' }}
            destroyOnClose
            title={title}
            visible={props.modalVisible}
            maskClosable={props.maskClosable ?? false}
            footer={renderBottomButton()}
            onCancel={() => {
                if (props.onCancel != undefined) props.onCancel();
                else closeModal();
            }}
        >
            <Form
                form={form}
                layout="horizontal"
                name="merchantLicenseModify"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
            >
                <Row>
                    <Col span={24}>
                        {(!IsView &&
                            <FormItem
                                label="????????????"
                                name="pmName"
                                rules={[{ required: true, message: '?????????????????????!' }]}
                                initialValue={license.pmName}
                                labelCol={{ span: 3 }}
                                wrapperCol={{ span: 21 }}
                            >
                                <Search readOnly={true} placeholder="????????????" onSearch={onSearchMerchant} />
                            </FormItem>)}
                        {(IsView &&
                            <FormItem
                                label="????????????"
                                name="pmName"
                                rules={[{ required: true, message: '?????????????????????!' }]}
                                initialValue={license.pmName}
                                labelCol={{ span: 3 }}
                                wrapperCol={{ span: 21 }}
                            >
                                <Input readOnly={true} placeholder="????????????" />
                            </FormItem>)}
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label="????????????" name="appCode"
                            rules={[{ required: true, message: '???????????????!' }]}
                            initialValue={license.appCode}>
                            <Select disabled={IsView}>
                                {busiAppList.map((app: GLOBAL.StrKeyValue) => {
                                    return <Option key={app.key}>
                                        <span>{app.value}</span>
                                    </Option>
                                })}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="????????????" name="moduleCode"
                            rules={[{ required: true, message: '???????????????!' }]}
                            initialValue={license.moduleCode}>
                            <Select disabled={IsView}>
                                {busiModuleList.map((app: GLOBAL.StrKeyValue) => {
                                    return <Option key={app.key}>
                                        <span>{app.value}</span>
                                    </Option>
                                })}
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label="????????????" name="startDate"
                            rules={[{ required: true, message: '?????????????????????!' }]}
                            initialValue={moment(string2Date(license.startDate), 'YYYY/MM/DD')}>
                            <DatePicker format="YYYY-MM-DD" locale={locale}
                                style={{ width: "100%" }}
                                disabledDate={disabledDate}
                                allowClear={false}
                                inputReadOnly={true}
                                disabled={IsView}
                                showTime={{ hideDisabledOptions: true, }}
                                onChange={onStartDateChanged} />
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="????????????" name="monthCount"
                            rules={[{ required: true, message: '???????????????!' }]}
                            initialValue={license.monthCount + ''}>
                            <Select onChange={onMonthCountChanged} disabled={IsView}>
                                <Option key={'1'}>
                                    <span>{'1??????'}</span>
                                </Option>
                                <Option key={'2'}>
                                    <span>{'2??????'}</span>
                                </Option>
                                <Option key={'3'}>
                                    <span>{'3??????'}</span>
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label="????????????" name="endDate"
                            rules={[{ required: true, message: '?????????????????????!' }]}
                            initialValue={moment(string2Date(license.endDate), 'YYYY/MM/DD')}>
                            <DatePicker format="YYYY-MM-DD" locale={locale}
                                style={{ width: "100%" }}
                                disabledDate={disabledDate}
                                allowClear={false}
                                inputReadOnly={true}
                                disabled={true}
                                showTime={{ hideDisabledOptions: true, }} />
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="?????????"
                            name="copyCount"
                            rules={[{ required: true, message: '??????????????????!' }]}
                            initialValue={license.copyCount}
                        >
                            <Input readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <FormItem
                            label="????????????"
                            name="terminalsList"
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 21 }}
                        >
                            <div
                                id="scrollableDiv"
                                style={{
                                    height: 300,
                                    overflow: 'auto',
                                    padding: '0 0px',
                                    border: '1px solid rgba(140, 140, 140, 0.35)',
                                }}
                            >
                                <List
                                    grid={{ gutter: 26, column: 3 }}
                                    dataSource={merhcantTerminalList}
                                    renderItem={(item, index) => (
                                        <List.Item className={licenseStyle.terminalCardStyle}>
                                            <Card>
                                                <Row gutter={24}>
                                                    <Col span={19}>
                                                        <Tag icon={<LaptopOutlined />} />
                                                    </Col>
                                                    <Col span={5}>
                                                        <Checkbox onChange={(e: CheckboxChangeEvent) => { onTerminalChanged(e, item, index) }}
                                                            checked={terminalSelList[index]} />
                                                    </Col>
                                                </Row>
                                                <hr color='#cd201f' />
                                                <Row><Col>{<Tag>??????</Tag>}</Col><Col>{item.name}</Col></Row>
                                                <Row><Col>{<Tag>??????</Tag>}</Col><Col>{item.term}</Col></Row>
                                                <Row><Col>{<Tag>??????</Tag>}</Col><Col>{item.ip}</Col></Row>
                                            </Card>
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default LicenseModifyForm;

export const showLicenseModifyForm = (IsView: boolean, props?: any) => {
    const param = {
        modalVisible: true,
        IsView,
        ...props,
    };
    showModal(LicenseModifyForm, param);
};
