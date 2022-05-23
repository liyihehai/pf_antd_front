import React, { useState, useEffect } from 'react';
import { Row, Col, List, Button, Card, Tag, Space } from 'antd';
import { LaptopOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { genRandomCode } from '@/components/Global/stringUtil';
import licenseStyle from '../css/index.less';
import { showMerchantTerminalEdit } from './MerchantTerminalEdit';

const MerchantTerminalTab: React.FC<MerSetting.TerminalTabProp> = (props) => {
    const [terminals, setTerminals] = useState<string>(props.terminals ?? '[]');
    const [terminalList, setTerminalList] = useState<MerSetting.Terminal[]>(JSON.parse(terminals) ?? []);

    useEffect(() => {
        setTerminals(props.terminals);
    }, [props.terminals]);

    const refreshList = (list: MerSetting.Terminal[]) => {
        setTerminalList(list);
        const t = JSON.stringify(list);
        setTerminals(t);
        props.onTerminalsChanged(t);
    }
    const onAddTerminal = () => {
        const term = {
            term: 'term:' + genRandomCode(10),
            ip: '',
            name: '',
        };
        showMerchantTerminalEdit({
            terminal: term,
            onOk: (ret: MerSetting.Terminal) => {
                const list = [...terminalList];
                list[list.length] = ret;
                refreshList(list);
            },
            IsView: false,
        });
    }
    const onEditTerminal = (item: MerSetting.Terminal, index: number) => {
        showMerchantTerminalEdit({
            terminal: item,
            onOk: (ret: MerSetting.Terminal) => {
                const list = [...terminalList];
                list[index] = ret;
                refreshList(list);
            },
            IsView: false,
        });
    }
    const onDeleteTerminal = (item: MerSetting.Terminal, index: number) => {
        const list = [...terminalList];
        list.splice(index, 1);
        refreshList(list);
    }

    return (
        <div>
            <Row>
                <Col span={18}>
                    <span>商户终端列表</span>
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                    <span><Button
                        className={licenseStyle.addTerminalStyle}
                        key='addTerminal'
                        type="default"
                        onClick={() => {
                            onAddTerminal();
                        }}
                    >添加终端</Button>
                    </span>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
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
                            dataSource={terminalList}
                            renderItem={(item, index) => (
                                <List.Item className={licenseStyle.terminalCardStyle}>
                                    <Card>
                                        <Row gutter={24}>
                                            <Col span={17}>
                                                <Tag icon={<LaptopOutlined />} />
                                            </Col>
                                            <Col span={7}>
                                                <Space>
                                                    <a onClick={() => { onEditTerminal(item, index); }}>
                                                        <EditOutlined />
                                                    </a>
                                                    <a onClick={() => { onDeleteTerminal(item, index); }}>
                                                        <DeleteOutlined />
                                                    </a>
                                                </Space>
                                            </Col>
                                        </Row>
                                        <hr color='#cd201f' />
                                        <Row><Col>{<Tag>名称</Tag>}</Col><Col>{item.name}</Col></Row>
                                        <Row><Col>{<Tag>编号</Tag>}</Col><Col>{item.term}</Col></Row>
                                        <Row><Col>{<Tag>地址</Tag>}</Col><Col>{item.ip}</Col></Row>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};
export default MerchantTerminalTab;
