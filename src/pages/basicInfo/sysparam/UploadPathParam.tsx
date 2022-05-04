import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import styles from '@/components/Global/global.less';
import { Space, Row, Col, Button, Table, message, Modal } from 'antd';
import { uploadPathParam } from '@/services/pf-basic';
import { showAppFuncFilePathForm } from './component/AppFuncFilePathForm';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { deleteUploadPathItem, notifyReloadUploadPath } from '@/services/pf-basic';

const UploadFileParam: React.FC = () => {
  const [appFuncFactorys, setAppFuncFactorys] = useState<SysParm.AppFuncFactory[]>([]);
  const [selAppFuncFactory, setSelAppFuncFactory] = useState<SysParm.AppFuncFactory>({});
  const [funcPathMap, setFuncPathMap] = useState<SysParm.AppFuncFilePath[]>(
    selAppFuncFactory.funcPathMap ?? [],
  );

  const setAppFuncFactory = (factory: SysParm.AppFuncFactory) => {
    setSelAppFuncFactory(factory);
    const newList: SysParm.AppFuncFilePath[] = [];
    if (factory.funcPathMap && factory.funcPathMap.length > 0) {
      for (let i = 0; i < factory.funcPathMap.length; i++) newList[i] = factory.funcPathMap[i];
    }
    setFuncPathMap(newList);
  };

  const loadUploadPathParam = async (sucMessage: boolean) => {
    const result = await uploadPathParam({});
    if (result) {
      if (result.success) {
        setAppFuncFactorys(result.data);
        if (!selAppFuncFactory.appCode) {
          if (result.data.length > 0) setAppFuncFactory(result.data[0]);
        } else {
          if (result.data.length > 0) {
            for (let i = 0; i < result.data.length; i++) {
              if (result.data[i].appCode == selAppFuncFactory.appCode) {
                setAppFuncFactory(result.data[i]);
                break;
              }
            }
          }
        }
        if (sucMessage) message.success('刷新上传路径系统参数成功!');
      } else {
        if (sucMessage) message.error(result.errorMessage);
      }
    }
  };

  useEffect(() => {
    loadUploadPathParam(false);
  }, []);

  const onClickAppRow = (record: SysParm.AppFuncFactory) => {
    return {
      onClick: () => {
        setAppFuncFactory(record);
      },
    };
  };

  const onNewAppFuncPath = (refFactory: any) => {
    const f = refFactory ? refFactory : selAppFuncFactory;
    showAppFuncFilePathForm({
      appFuncFilePath: { appCode: f.appCode },
      appFuncFactory: f,
      IsNew: true,
      onOk: (factory: SysParm.AppFuncFactory) => {
        setAppFuncFactory(factory);
        loadUploadPathParam(false);
      },
    });
  };

  const onClickModifyAppRow = (path: SysParm.AppFuncFilePath) => {
    const f = selAppFuncFactory;
    showAppFuncFilePathForm({
      appFuncFilePath: {
        appCode: f.appCode,
        funcCode: path.funcCode,
        path: path.path,
        pathMask: path.pathMask,
      },
      appFuncFactory: f,
      IsNew: false,
      onOk: (factory: SysParm.AppFuncFactory) => {
        setAppFuncFactory(factory);
        loadUploadPathParam(false);
      },
    });
  };

  const onClickAddAppRow = (record: any) => {
    onClickAppRow(record);
    onNewAppFuncPath(record);
  };

  const onClickDelAppRow = (path: SysParm.AppFuncFilePath) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要删除上传文件路径参数[' + path.funcCode + ']设置吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const result = await deleteUploadPathItem(path);
        if (result && result.success) {
          loadUploadPathParam(false);
          message.success(result.errorMessage);
        }
      },
    });
  };

  const notifyUploadPathParam = () => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要通知服务应用重载文件上传路径设置吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const result = await notifyReloadUploadPath();
        if (result && result.success) {
          message.success(result.errorMessage);
        }
      },
    });
  };

  const appColumns = [
    {
      title: '应用',
      dataIndex: 'appName',
    },
    {
      title: '',
      dataIndex: 'appCode',
      width: '45px',
      render: (code: any, record: any) => {
        return (
          <Button
            type="default"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => {
              onClickAddAppRow(record);
            }}
          />
        );
      },
    },
  ];
  const funcColumns = [
    {
      title: '功能代码',
      dataIndex: 'funcCode',
      width: '150px',
    },
    {
      title: '功能路径',
      dataIndex: 'path',
      width: '350px',
    },
    {
      title: '路径掩码',
      dataIndex: 'pathMask',
      width: '250px',
    },
    {
      title: '',
      dataIndex: 'appCode',
      width: '90px',
      render: (code: any, record: any) => {
        return (
          <Space>
            <Button
              type="default"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                onClickModifyAppRow(record);
              }}
            />
            <Button
              type="default"
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                onClickDelAppRow(record);
              }}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer title={false} className={styles.modelStyles}>
      <Row style={{ paddingLeft: '15px', paddingBottom: '10px' }}>
        <Col span={12} style={{ paddingTop: '10px' }}>
          <span>选中应用：</span>
          <span>{selAppFuncFactory ? selAppFuncFactory.appName : ''}</span>
        </Col>
        <Col span={12} style={{ textAlignLast: 'end' }}>
          <Space>
            <Button
              onClick={() => {
                notifyUploadPathParam();
              }}
            >
              重载
            </Button>
            <Button
              onClick={() => {
                loadUploadPathParam(true);
              }}
            >
              刷新
            </Button>
          </Space>
        </Col>
      </Row>
      <Row>
        <Col span={5}>
          <Table
            columns={appColumns}
            dataSource={appFuncFactorys}
            pagination={false}
            onRow={onClickAppRow}
            scroll={{ x: '100%', y: 640 }}
            size="small"
            rowKey={'appCode'}
          />
        </Col>
        <Col span={19}>
          <Table
            columns={funcColumns}
            dataSource={funcPathMap}
            pagination={false}
            scroll={{ x: '100%', y: 640 }}
            size="small"
            rowKey={'funcCode'}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default UploadFileParam;
