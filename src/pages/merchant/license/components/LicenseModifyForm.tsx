/* eslint-disable @typescript-eslint/consistent-type-imports */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, DatePicker, Row, Col, List, Typography, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';
import { saveMerchantLicense } from '@/services/merchant';
import { showMerchantSelectForm } from '@/pages/globalForm/MerchantSelectForm';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { string2Date, monthAdd, date2String } from '@/components/Global/dateutil';
import { genRandomCode } from '@/components/Global/stringUtil';

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
    const isModify: boolean = license.id && license.id > 0 ? true : false;

    useEffect(() => { }, [props]);
    const [form] = Form.useForm();

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const save = {
                ...license,
                ...values,
            };
            if (license.copyCount <= 0) {
                message.error("至少指定一个终端 ");
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
            onSelected: (selItems: any | any[]) => {
                const selMerchant: MerSetting.MerchantItem = selItems;
                license.pmCode = selMerchant.pmCode ?? '';
                license.pmName = selMerchant.pmName ?? '';
                license.pmShortName = selMerchant.pmShortName ?? '';
                form.setFieldsValue({ pmName: license.pmName });
                closeModal();
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

    const onAddTerminal = () => {
        const list = [...terminalList];
        const t = 'term:' + genRandomCode(10);
        list[list.length] = t;
        setTerminalList(list);
        onTerminalCountChanged(list);
    }

    const onCopyTerminal = () => {
        const $temp = document.createElement('input');
        document.body.append($temp);
        $temp.value = license.terminals;
        $temp.select();
        window.document.execCommand('copy');
        $temp.remove();
        message.success('终端序列已拷贝至剪贴板');
    }

    const onDeleteTerminal = (item: string) => {
        const list = [...terminalList];
        for (let i = 0; i < terminalList.length; i++) {
            if (list[i] == item) {
                list.splice(i, 1);
            }
        }
        setTerminalList(list);
        onTerminalCountChanged(list);
    }

    //渲染底部按钮
    const renderBottomButton = () => {
        const buttons = [];
        buttons.push(
            <Button
                key=''
                type="default"
                onClick={() => {
                    onCopyTerminal();
                }}
            >复制终端</Button>
        );
        if (!IsView) {
            buttons.push(
                <Button
                    key=''
                    type="default"
                    onClick={() => {
                        onAddTerminal();
                    }}
                >添加终端</Button>
            );
        }
        buttons.push(
            <Button key="btnClose" onClick={() => closeModal()}>
                关闭
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
                    提交
                </Button>,
            );
        }
        return buttons;
    };

    //不能选择的日期
    const disabledDate = (current: any) => {
        // 当前之前日期不可选
        return current < moment().subtract(1, 'day');
    }

    const title = '商户许可-[' + ((license.feeType == 1) ? '正式' : '试用') + ']';

    return (
        <Modal
            className={styles.modelStyles}
            width={640}
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
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
            >
                <Row>
                    <Col span={24}>
                        {(!IsView &&
                            <FormItem
                                label="商户名称"
                                name="pmName"
                                rules={[{ required: true, message: '请输入商户名称!' }]}
                                initialValue={license.pmName}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                            >
                                <Search readOnly={true} placeholder="输入商户" onSearch={onSearchMerchant} />
                            </FormItem>)}
                        {(IsView &&
                            <FormItem
                                label="商户名称"
                                name="pmName"
                                rules={[{ required: true, message: '请输入商户名称!' }]}
                                initialValue={license.pmName}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                            >
                                <Input readOnly={true} placeholder="输入商户" />
                            </FormItem>)}
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label="选择应用" name="appCode"
                            rules={[{ required: true, message: '请选择应用!' }]}
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
                        <FormItem label="选择模块" name="moduleCode"
                            rules={[{ required: true, message: '请选择模块!' }]}
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
                        <FormItem label="起始日期" name="startDate"
                            rules={[{ required: true, message: '请输入起始日期!' }]}
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
                        <FormItem label="选择月数" name="monthCount"
                            rules={[{ required: true, message: '请输入月数!' }]}
                            initialValue={license.monthCount + ''}>
                            <Select onChange={onMonthCountChanged} disabled={IsView}>
                                <Option key={'1'}>
                                    <span>{'1个月'}</span>
                                </Option>
                                <Option key={'2'}>
                                    <span>{'2个月'}</span>
                                </Option>
                                <Option key={'3'}>
                                    <span>{'3个月'}</span>
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label="结束日期" name="endDate"
                            rules={[{ required: true, message: '请输入结束日期!' }]}
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
                            label="拷贝数"
                            name="copyCount"
                            rules={[{ required: true, message: '请输入拷贝数!' }]}
                            initialValue={license.copyCount}
                        >
                            <Input readOnly={true} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <FormItem
                            label="终端序列"
                            name="terminalsList"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
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
                                <List bordered
                                    dataSource={terminalList}
                                    renderItem={(item, index) => (
                                        <List.Item
                                            actions={[(!IsView && <Button
                                                key=''
                                                type="default"
                                                shape="circle"
                                                icon={<DeleteOutlined />}
                                                onClick={() => {
                                                    onDeleteTerminal(item);
                                                }}
                                            />)]}>
                                            <Typography.Text mark>{'[终端' + (index + 1) + ']'}</Typography.Text> {item}
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
