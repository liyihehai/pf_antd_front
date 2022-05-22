/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig, RequestConfig, RequestOptionsInit, ResponseError } from 'umi';
import { history, Link } from 'umi';
import { notification } from 'antd';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';
import fetchMenuData from '@/components/Global/MenuComponent';
import SvgIcon from '@/components/SvgIcon';
import { getCurrentOperator, getMenuFunctiong } from '@/components/Global/LocalStoreUtil';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
    loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
    settings?: Partial<LayoutSettings>;
    currentUser?: API.CurrentUser;
    loading?: boolean;
    fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
    const fetchUserInfo = async () => {
        try {
            const msg = await queryCurrentUser();
            return msg?.data;
        } catch (error) {
            history.push(loginPath);
        }
        return undefined;
    };
    // 如果是登录页面，不执行
    if (history.location.pathname !== loginPath) {
        const currentUser = await fetchUserInfo();
        return {
            fetchUserInfo,
            currentUser,
            settings: defaultSettings,
        };
    }
    return {
        fetchUserInfo,
        settings: defaultSettings,
    };
}
//请求前拦截，并在请求头中增减token
const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
    const operator = getCurrentOperator();
    const authHeader = { AjaxToken: operator?.signature };
    return {
        url: `${url}`,
        options: { ...options, interceptors: true, headers: authHeader },
    };
};
//响应后拦截
const autoResponseInterceptors = (response: Response, options: RequestOptionsInit) => {
    if (!response.ok) {
        const { unAutoErrorMsg } = options;
        if (unAutoErrorMsg) {
            const newResponse = { ...response };
            newResponse.ok = true;
            return newResponse;
        }
    }
    return response;
};

const errorHandler = (err: ResponseError) => {
    try {
        const { response } = err;
        if (response && response.errorCode == '1009') {
            history.push(loginPath);
            return;
        }
        if (response && response.errorCode != '0') {
            const { errorMessage, status, url, statusText } = response;
            if (errorMessage) {
                notification.error({
                    message: `请求错误`,
                    description: errorMessage,
                });
            } else if (status && statusText) {
                notification.error({
                    message: `请求错误: ${status} ${url}`,
                    description: statusText,
                });
            }
        }
        if (!response) {
            notification.error({
                description: '您的网络发生异常，无法连接服务器',
                message: '网络异常',
            });
        }
    } catch (error) {
        console.info('error info:' + error);
        history.push(loginPath);
    }
};

export const request: RequestConfig = {
    errorHandler,
    // 新增自动添加AccessToken的请求前拦截器
    requestInterceptors: [authHeaderInterceptor],
    responseInterceptors: [autoResponseInterceptors],
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
    return {
        rightContentRender: () => <RightContent />,
        disableContentMargin: false,
        // waterMarkProps: {
        //   content: initialState?.currentUser?.name,
        // },
        footerRender: () => <Footer />,
        onPageChange: () => {
            const { location } = history;
            // 如果没有登录，重定向到 login
            if (!initialState?.currentUser && location.pathname !== loginPath) {
                history.push(loginPath);
            }
        },
        links: isDev
            ? [
                <Link key="link-key-openapi" to="/umi/plugin/openapi" target="_blank">
                    <LinkOutlined />
                    <span>OpenAPI 文档</span>
                </Link>,
                <Link key="link-key-docs" to="/~docs">
                    <BookOutlined />
                    <span>业务组件文档</span>
                </Link>,
            ]
            : [],
        menuHeaderRender: undefined,
        menuItemRender: (menuItemProps, defaultDom) => {
            if (menuItemProps.isUrl || !menuItemProps.path) {
                return defaultDom;
            }
            return (
                <Link to={menuItemProps?.path ?? '/#'}>
                    {menuItemProps.icon && <SvgIcon type={menuItemProps.icon.toString()} />}{' '}
                    {menuItemProps.name}
                </Link>
            );
        },
        subMenuItemRender: (subMenuITem) => {
            return (
                <span>
                    <span className="ant-pro-menu-item">
                        <span role="img" className="anticon">
                            {subMenuITem.icon && <SvgIcon type={subMenuITem.icon.toString()} />}
                        </span>
                        <span>{subMenuITem.name}</span>
                    </span>
                </span>
            );
        },
        breadcrumbRender: (routers = []) => {
            const { routePath } = getMenuFunctiong(history.location.pathname) || {};
            const arr: any[] = [];
            if (routePath) {
                const names: string[] = routePath.split('/');
                names.forEach((name) => arr.push({ breadcrumbName: name }));
            }
            return arr;
        },
        // 自定义 403 页面
        // unAccessible: <div>unAccessible</div>,
        // 增加一个 loading 的状态
        childrenRender: (children, props) => {
            if (initialState?.loading) return <PageLoading />;
            return (
                <>
                    {children}
                    {!props.location?.pathname?.includes('/login') && (
                        <SettingDrawer
                            enableDarkTheme
                            settings={initialState?.settings}
                            onSettingChange={(settings) => {
                                setInitialState((preInitialState) => ({
                                    ...preInitialState,
                                    settings,
                                }));
                            }}
                        />
                    )}
                </>
            );
        },
        ...initialState?.settings,
        menu: {
            // 每当 initialState?.currentUser?.userid 发生修改时重新执行 request
            locale: false,
            params: {
                userId: initialState?.currentUser?.userid,
            },
            request: async (params, defaultMenuData) => {
                // initialState.currentUser 中包含了所有用户信息
                const menuData = await fetchMenuData(params, defaultMenuData);
                return menuData;
            },
            defaultOpenAll: false,
        },
        openKeys: false,
    };
};
