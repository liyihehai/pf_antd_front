/* eslint-disable @typescript-eslint/consistent-type-imports */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Row, Col, Tree, Card, message, Space, Empty } from 'antd';
import SvgIcon from '@/components/SvgIcon';
import { showModal, closeModal } from '@/components/Global';
import styles from '@/components/Global/global.less';
import { saveMerchantAppMenu } from '@/services/merchant';
import { FolderOutlined, FileOutlined } from '@ant-design/icons';
import { showMenuUpdateForm } from '../../../sysset/menu/components/MenuUpdateForm';
import { showFuncUpdateForm } from '../../../sysset/menu/components/FuncUpdateForm';
import MenuInfoForm from '../../../sysset/menu/components/MenuInfoForm';
import FuncInfoForm from '../../../sysset/menu/components/FuncInfoForm';

const { Search } = Input;

type AppMenuFormProp = GLOBAL.FormProps & {
    appMenu: MerAppMenu.MenuItem;
    IsView: boolean;
    onOk: (menu: MerAppMenu.MenuItem) => void;
    fEnterList?: any[];
};
const MerchantAppMenuForm: React.FC<AppMenuFormProp> = (props) => {

    const [appMenu] = useState<MerAppMenu.MenuItem>(props.appMenu ?? {});
    const [menuType] = useState<number>(appMenu.menuType ?? 1);
    const [fEnterList] = useState<any[]>(props.fEnterList ?? []);
    const [menuData, setMenuData] = useState<any[]>((appMenu.menuContent) ? JSON.parse(appMenu.menuContent) : []);
    const [IsView] = useState<boolean>(props.IsView ?? false);
    const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
    const [dataList, setDataList] = useState<any[]>([]);
    const [currentMenu, setCurrentMenu] = useState<any>({});
    const [currentFunc, setCurrentFunc] = useState<any>({});
    const [selectType, setSelectType] = useState<number>(0);
    const [gData, setGData] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');

    const [form] = Form.useForm();

    const getItemKey = (item: any) => {
        return item.funCode ? item.menuCode + '-' + item.funCode : item.menuCode;
    };

    const onExpand = (expanded_keys: any[]) => {
        setExpandedKeys(expanded_keys);
        setAutoExpandParent(false);
    };

    const setNullSelect = () => {
        setSelectType(0);
        setCurrentFunc({});
        setCurrentMenu({});
    }

    const getParentKey = (key: any, tree: any): any => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some((item: any) => getItemKey(item) === key)) {
                    parentKey = getItemKey(node);
                } else if (getParentKey(key, node.children)) {
                    parentKey = getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    };

    const onSearchChanged = (e: any) => {
        const { value } = e.target;
        const expanded_Keys = dataList
            .map((item: any) => {
                if (item.title.indexOf(value) > -1) {
                    return getParentKey(item.key, gData);
                }
                return null;
            })
            .filter((item: any, i: any, self: any) => item && self.indexOf(item) === i);
        setExpandedKeys(expanded_Keys);
        setSearchValue(value);
        setAutoExpandParent(true);
    };

    const getMenu = (mCode: string, tree: any): any => {
        for (let i = 0; i < tree.length; i++) {
            const menu = tree[i];
            if (menu.menuCode === mCode) {
                return menu;
            } else {
                if (menu.children && menu.children.length > 0) {
                    const subMenu = getMenu(mCode, menu.children);
                    if (subMenu) {
                        return subMenu;
                    }
                }
            }
        }
        return undefined;
    };

    const getFunc = (fCode: string, tree: any): any => {
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.funCode === fCode) {
                return node;
            } else {
                if (node.children && node.children.length > 0) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const subNode = getFunc(fCode, node.children);
                    if (subNode) {
                        return subNode;
                    }
                }
            }
        }
        return undefined;
    };

    const generateList = (dList: any[], data: any[]) => {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const itemTile = item.funName ?? item.menuName;
            const itemKey = getItemKey(item);
            dList.push({ key: itemKey, title: itemTile });
            if (item.children) {
                generateList(dList, item.children);
            }
        }
    };

    const reloadMenus = () => {
        const dList: any[] = [];
        generateList(dList, menuData);
        setGData(menuData);
        setDataList(dList);
    };

    const onMenuChanged = (menu: MerAppMenu.AppMenu) => {
        const srcMenu = getMenu(menu.menuCode, menuData)
        if (srcMenu) {
            srcMenu.menuName = menu.menuName;
            srcMenu.menuPath = menu.menuPath;
            srcMenu.menuState = menu.menuState;
            srcMenu.menuIcon = menu.menuIcon;
            const data = [...menuData];
            setMenuData(data);
            setSelectType(1);
            setCurrentMenu(srcMenu);
        }
    };

    const onDeleteMenu = (menu: MerAppMenu.AppMenu) => {
        const srcMenu = getMenu(menu.menuCode, menuData)
        if (srcMenu) {
            if (srcMenu.children && srcMenu.children.length > 0) {
                message.error('本菜单存在下级菜单或功能，不能删除');
                return;
            }
            let isDel = false;
            if (srcMenu.menuClass <= 1) {
                for (let i = 0; i < menuData.length; i++) {
                    if (menuData[i].menuCode == menu.menuCode) {
                        menuData.splice(i, 1);
                        isDel = true;
                        break;
                    }
                }
            } else {
                const parentMenu = getMenu(srcMenu.parentMenuCode, menuData);
                if (parentMenu) {
                    for (let i = 0; i < parentMenu.children.length; i++) {
                        if (parentMenu.children[i].menuCode == menu.menuCode) {
                            parentMenu.children.splice(i, 1);
                            isDel = true;
                            break;
                        }
                    }
                }
            }
            if (isDel) {
                const data = [...menuData];
                setMenuData(data);
                setNullSelect();
            }
        }
    }

    const onFuncChanged = (func: MerAppMenu.AppFunc) => {
        const srcFunc = getFunc(func.funCode, menuData)
        if (srcFunc) {
            srcFunc.funName = func.funName;
            srcFunc.funPath = func.funPath;
            srcFunc.funState = func.funState;
            srcFunc.funIcon = func.funIcon;
            srcFunc.authCode = func.authCode;
            srcFunc.funComponent = func.funComponent;
            srcFunc.funParam = func.funParam;
            const data = [...menuData];
            setMenuData(data);
            setSelectType(2);
            setCurrentFunc(srcFunc);
        }
    }

    const onDeleteFunc = (func: MerAppMenu.AppFunc) => {
        const srcMenu = getMenu(func.menuCode, menuData)
        if (srcMenu) {
            let isDel = false;
            if (srcMenu.children && srcMenu.children.length > 0) {
                for (let i = 0; i < srcMenu.children.length; i++) {
                    if (srcMenu.children[i].funCode == func.funCode) {
                        srcMenu.children.splice(i, 1);
                        isDel = true;
                        break;
                    }
                }
            }
            if (isDel) {
                const data = [...menuData];
                setMenuData(data);
                setNullSelect();
            }
        }
    }

    useEffect(() => { reloadMenus() }, [menuData]);

    const onSelect = (selectedKeys: React.Key[], info: { selected: boolean, selectedNodes: any, node: any, event: any }) => {
        const itemKey = info.node.key;
        if (itemKey) {
            if (itemKey.toString().indexOf('-') >= 0) {
                const funcCode = itemKey.toString().split('-')[1];
                //如果当前选中的为功能
                const newCurrent = { ...(getFunc(funcCode, gData) ?? {}) };
                setCurrentFunc(newCurrent);
                setSelectType(2);
            } else {
                //如果当前选中的为菜单
                setSelectType(1);
                const newCurrent = { ...(getMenu(itemKey.toString(), gData) ?? {}) };
                setCurrentMenu(newCurrent);
            }
        } else {
            setNullSelect();
        }
    };

    const loop = (data: any) =>
        data.map((item: any) => {
            const itemTile = item.funName ?? item.menuName;
            const itemCode = item.funCode ?? item.menuCode;
            const icon = item.funCode ? <FileOutlined /> : <FolderOutlined />;
            const alertStyle = item.menuState == 1 || item.funState == 1 ? undefined : { color: 'red' };
            const itemKey = getItemKey(item);
            const index = itemTile.indexOf(searchValue);
            const beforeStr = itemTile.substr(0, index);
            const afterStr = itemTile.substr(index + searchValue.length);
            const title =
                index > -1 ? (
                    <span>
                        {beforeStr}
                        <span className="site-tree-search-value">{'[' + itemCode + ']' + searchValue}</span>
                        {afterStr}
                    </span>
                ) : (
                    <span>{itemTile}</span>
                );
            if (item.children && item.children.length > 0) {
                return {
                    title,
                    key: itemKey,
                    icon,
                    style: alertStyle,
                    children: loop(item.children),
                };
            }
            return {
                title,
                key: itemKey,
                icon,
                style: alertStyle,
            };
        });

    const addTopMenu = () => {
        const param = {
            menu: {
                id: 0,
                menuCode: '',
                menuName: '顶级菜单',
                menuClass: 1,
                parentMenuCode: '',
                menuState: 1,
                menuPath: '',
                menuIcon: '',
            },
            merchantMenu: true,
            onOk: (retMenu: any) => {
                const data = [...menuData];
                if (!retMenu.menuCode) {
                    message.error('菜单代码不能为空');
                    return;
                }
                if (retMenu.menuCode.length != 2) {
                    message.error('顶级菜单代码只能是2位字符');
                    return;
                }
                const tmpMenu = getMenu(retMenu.menuCode, data);
                if (tmpMenu) {
                    message.error('菜单代码不能重复');
                    return;
                }
                data[data.length] = retMenu;
                setMenuData(data);
                setSelectType(1);
                setCurrentMenu(retMenu);
                closeModal();
            }
        };
        showMenuUpdateForm(param);
    };

    const addSubMenu = () => {
        const parentMenuCode = currentMenu?.menuCode ?? '';
        const param = {
            menu: {
                id: 0,
                menuCode: '',
                menuName: '',
                menuClass: Number(currentMenu?.menuClass ?? 0) + 1,
                parentMenuCode: parentMenuCode,
                menuState: 1,
                menuPath: currentMenu?.menuPath ?? '',
                menuIcon: '',
            },
            merchantMenu: true,
            onOk: (retMenu: any) => {
                const data = [...menuData];
                if (!retMenu.menuCode) {
                    message.error('菜单代码不能为空');
                    return;
                }
                if (retMenu.menuCode.length != retMenu.parentMenuCode.length + 2) {
                    message.error('菜单代码长度只能是父菜单代码加2位字符的长度');
                    return;
                }
                if (retMenu.menuCode.substr(0, retMenu.parentMenuCode.length) != retMenu.parentMenuCode) {
                    message.error('子菜单代码必须包含父菜单代码');
                    return;
                }
                const tmpMenu = getMenu(retMenu.menuCode, data);
                if (tmpMenu) {
                    message.error('菜单代码不能重复');
                    return;
                }
                const parentMenu = getMenu(parentMenuCode, data);
                if (parentMenu) {
                    if (parentMenu.children) {
                        parentMenu.children[parentMenu.children.length] = retMenu;
                    } else {
                        parentMenu.children = [];
                        parentMenu.children[0] = retMenu;
                    }
                }
                setMenuData(data);
                setSelectType(1);
                setCurrentMenu(retMenu);
                closeModal();
            }
        };
        showMenuUpdateForm(param);
    };

    const addSubFunc = () => {
        const parentMenuCode = currentMenu?.menuCode ?? '';
        const param = {
            func: {
                menuCode: parentMenuCode,
                funCode: '',
                funName: '',
                authCode: '',
                funParam: '',
                funState: 1,
                funComponent: '',
                funPath: '',
                funIcon: '',
            },
            merchantMenu: true,
            onOk: (retFunc: any) => {
                const data = [...menuData];
                if (!retFunc.funCode) {
                    message.error('功能代码不能为空');
                    return;
                }
                if (retFunc.funCode.length != retFunc.menuCode.length + 2) {
                    message.error('功能代码长度只能是父菜单代码加2位字符的长度');
                    return;
                }
                if (retFunc.funCode.substr(0, retFunc.menuCode.length) != retFunc.menuCode) {
                    message.error('子菜单代码必须包含父菜单代码');
                    return;
                }
                const tmpFunc = getFunc(retFunc.funCode, data);
                if (tmpFunc) {
                    message.error('功能代码不能重复');
                    return;
                }
                const parentMenu = getMenu(retFunc.menuCode, data);
                if (parentMenu) {
                    if (parentMenu.children) {
                        parentMenu.children[parentMenu.children.length] = retFunc;
                    } else {
                        parentMenu.children = [];
                        parentMenu.children[0] = retFunc;
                    }
                }
                setMenuData(data);
                setSelectType(2);
                setCurrentFunc(retFunc);
                closeModal();
            },
            fEnterList,
        };
        showFuncUpdateForm(param);
    };

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const save = {
                ...appMenu,
                ...values,
                menuContent: JSON.stringify(menuData),
            };
            const result = await saveMerchantAppMenu(save);
            if (result.success && props.onOk) {
                props.onOk(result.data);
            }
        } catch (errorInfo) { }
    };

    //渲染底部按钮
    const renderBottomButton = () => {
        const buttons = [];
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

    const title = '应用菜单设置[' + ((menuType == 1) ? '全局' : '商户') + ']';

    return (
        <Modal
            className={styles.modelStyles}
            width={1020}
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
            <Row gutter={24}>
                <Col span={10}>
                    <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onSearchChanged} />
                    <Card>
                        <Tree
                            showLine={{ showLeafIcon: false }}
                            showIcon={true}
                            onExpand={onExpand}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}
                            treeData={loop(gData)}
                            onSelect={onSelect}
                            style={{ height: 'calc(100vh - 250px)', overflowY: 'scroll' }}
                        />
                    </Card>
                </Col>
                <Col span={14}>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Card>
                                <Space direction="vertical" size="small" style={{ display: 'flex' }}>
                                    <Row gutter={24} justify="center" align="middle">
                                        <Col span={4} style={{
                                            paddingLeft: '25px',
                                            paddingRight: '0px'
                                        }}><span>应用名称:</span></Col>
                                        <Col span={20} style={{
                                            paddingLeft: '0px',
                                            paddingRight: '12px'
                                        }}>
                                            <Input readOnly={true} value={appMenu.appName} />
                                        </Col>
                                    </Row>
                                    {(menuType == 2) && <Row gutter={24} justify="center" align="middle">
                                        <Col span={4} style={{
                                            paddingLeft: '25px',
                                            paddingRight: '0px'
                                        }}><span>商户名称:</span></Col>
                                        <Col span={20} style={{
                                            paddingLeft: '0px',
                                            paddingRight: '12px'
                                        }}>
                                            <Input readOnly={true} value={appMenu.pmName} />
                                        </Col>
                                    </Row>}
                                    {(menuType == 2) && <Row gutter={24} justify="center" align="middle">
                                        <Col span={4} style={{
                                            paddingLeft: '25px',
                                            paddingRight: '0px'
                                        }}><span>商户简称:</span></Col>
                                        <Col span={20} style={{
                                            paddingLeft: '0px',
                                            paddingRight: '12px'
                                        }}>
                                            <Input readOnly={true} value={appMenu.pmShortName} />
                                        </Col>
                                    </Row>}
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                    {(!IsView) && <Row gutter={24}>
                        <Col span={24}>
                            <Card>
                                <Row>
                                    <Col>
                                        <Space>
                                            <Button
                                                type="primary"
                                                onClick={() => addTopMenu()}
                                                icon={<SvgIcon type={'icon-jbs-testquanxianshenpi'} width={50} height={50} />}
                                            >
                                                添加顶级菜单
                                            </Button>
                                            {selectType == 1 && (
                                                <Button type="primary" onClick={() => addSubMenu()}>
                                                    添加子菜单
                                                </Button>
                                            )}
                                            {selectType == 1 && (
                                                <Button type="primary" onClick={() => addSubFunc()}>
                                                    添加子功能
                                                </Button>
                                            )}
                                        </Space>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>}
                    <Row gutter={24}>
                        <Col span={24}>
                            <Card>
                                {selectType == 1 && (
                                    <MenuInfoForm menu={currentMenu}
                                        onMenuChanged={onMenuChanged}
                                        onDeleteMenu={onDeleteMenu}
                                        merchantMenu={true}
                                        IsView={IsView}
                                    />
                                )}
                                {selectType == 2 && (
                                    <FuncInfoForm
                                        func={currentFunc}
                                        onFuncChanged={onFuncChanged}
                                        onDeleteFunc={onDeleteFunc}
                                        fEnterList={fEnterList}
                                        merchantMenu={true}
                                        IsView={IsView}
                                    />
                                )}
                                {(selectType != 1 && selectType != 2) && <Empty />}
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Modal>
    );
}

export default MerchantAppMenuForm;

export const showMerchantAppMenuForm = (IsView: boolean, props?: any) => {
    const param = {
        modalVisible: true,
        IsView,
        ...props,
    };
    showModal(MerchantAppMenuForm, param);
};