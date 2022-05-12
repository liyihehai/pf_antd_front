declare namespace MerSetting {
  type MerchantItem = {
    id?: number; //主键ID
    pmCode?: string; //商户代码
    pmName?: string; //商户名称
    pmShortName?: string; //商户简称
    pmCompanyPerson?: number; //1公司，2个人
    pmState?: number; //服务状态：-1下架  0未认证  1可服务 2暂停服务
    createTime?: Date; //创建时间
    applyEmail?: string; //申请邮箱
  };

  type MerchantExpand = {
    pmCode?: string; //商户代码
    pmBusiType?: string; //行业分类,数据字典LIB_PMBUSI_TYPE
    pmCountry?: string; //对应数据字典国家地区LIB_COUNTRY
    pmProvince?: string; //省份
    pmCity?: string; //对应数据字典城市地区LIB_CITY
    pmArea?: string; //区县
    pmAddress?: string; //地址
    pmPcazh?: string; //省市县（或市市区）的联合中文
    pmZipcode?: string; //邮编
    pmCoordinate?: string; //地理坐标
    pmLongitude?: number; //经度
    pmLatitude?: number; //纬度
    pmLinkName?: string; //联系姓名
    pmLinkPhone?: string; //联系电话
    pmCsrPhone?: string; //客服电话
    pmEmail?: string; //电子邮箱
    pmIntroduce?: string; //商户简介
    pmLogo?: string; //商户标志
    pmPic1?: string; //商户图片1
    pmPic2?: string; //商户图片2
    pmPic3?: string; //商户图片3
    pmRemark?: string; //商户备注
    pmLegalName?: string; //法人姓名（个人为个人姓名）
    pmLegalIdNum?: string; //工商登记号（个人为身份证号）
    pmCertificatePic1?: string; //个人为身份证正面，公司为工商登记证
    pmCertificatePic2?: string; //个人为身份证反面
    pmCertificatePic3?: string; //证件图片3
    pmCertificatePic4?: string; //证件图片4
    createTime?: Date; //创建时间
  };

  type MerchantUtiAccount = {
    id?: number; //KEY id
    pmCode?: string; //商户代码
    accountCode?: string; //账户代码
    accountPws?: string; //账户密码
    accountToken?: string; //Token
    tokenCreateTime?: Date; //Token创建时间
    tokenExpireTime?: Date; //Token过期时间
    oldToken?: string; //老token
    oldTokenCreateTime?: Date; //老token创建时间
    oldtokenExpireTime?: Date; //老token过期时间
    secType?: string; //加密类型
    interfaceVersion?: string; //接口版本
    appRsaPubkey?: string; //APP RSA公钥
    appRsaPrikey?: string; //APP RSA私钥
    merRsaPubkey?: string; //商户 RSA公钥
    merRsaPrikey?: string; //商户 RSA私钥
    defBackUrl?: string; //默认回调地址
    validIpList?: string; //有效IP地址列表
    backId?: string; //商户认证号
    backKey?: string; //商户认证密码
    accountMemo?: string; //账户备注
    accountState?: number; //账户状态:0新建,1开通,2暂停,3注销
    busiOpenTime?: Date; //业务开通时间
    busiExpireTime?: Date; //业务到期时间
    createBy?: string; //创建人
    createTime?: Date; //创建时间
    updateBy?: string; //更改人
    updateTime?: Date; //最后更改时间
  };

  type MerchantTabProps = {
    merchant: MerchantItem;
    merchantExpand?: MerchantExpand;
    IsView?: boolean;
    busiTypeList: GLOBAL.StrKeyValue[];
  };

  type MerchantFormProps = MerchantTabProps & {
    onCancel?: () => void;
    onOk?: (merchant: MerchantItem, expand?: MerchantExpand) => void;
    modalVisible?: boolean;
    maskClosable?: boolean;
  };

  type UtiAccountProps = GlobalForm.ModelProps & {
    utiAccount: MerchantUtiAccount;
    pmShortName: string;
    onOk?: (account: MerchantUtiAccount) => void;
  };
}
