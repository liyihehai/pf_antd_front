declare namespace MApplay {
  type ApplayProps = {
    id?: number;
    pmCode: string; //商户代码
    pmName: string; //商户名称
    confirmType: number; //验证方式:{1,2}
    applyPhone: string; //电话号码
    applyEmail: string; //邮箱号码
    pmCompanyPerson: number; //公司或个人:{1,2}
    applyWays: number; //申请方式:{1,2,3,4}
    applyerCode: string; //申请人代码
    applyerName: string; //申请人姓名
    applyContent: string;
    applyMemo: string; //申请备注
    applyState: number; //申请状态:{-1,0,1,2,3,4}
    creatorCode: string; //创建人代码
    creatorName: string; //创建人姓名
    createTime: Date; //申请时间
    smRandomCode: string; //短信验证码

    opeCode: string;
    opeName: string;
    checkResult: number; //审核结果:1审核通过，0审核不通过
    checkDesc: string;
    checkerCode: string;
    checkerName: string;
    confirmName: string; //提交申请的操作员姓名
    lockTime: Date;

    actionType: number; //操作类型:1：新增，2：编辑
  };

  type ApplyFormProps = {
    onCancel?: (flag?: boolean, formVals?: MApplay.ApplayProps) => void;
    onOk?: (values: MApplay.ApplayProps) => Promise<void>;
    modalVisible?: boolean;
    apply: MApplay.ApplayProps;
    maskClosable?: boolean;
  };

  type MerchantExp = {
    id?: number;
    pmCode: string; //商户代码
    pmName: string; //商户名称
    pmShortName: string; //商户简称
    pmCompanyPerson: number; //公司或个人:1公司，2个人
    pmState: number; //服务状态：-1下架  0未认证  1可服务 2暂停服务
    createTime: Date; //创建时间
    applyEmail: string; //申请邮箱

    pmBusiType: string; //行业分类,数据字典LIB_PMBUSI_TYPE
    pmCountry: string; //对应数据字典国家地区LIB_COUNTRY
    pmProvince: string; //省份
    pmCity: string; //对应数据字典城市地区LIB_CITY
    pmArea: string; //区县
    pmPCAzh: string; //省市县（或市市区）的联合中文
    pmAddress: string; //地址
    pmZipcode: string; //邮编
    pmCoordinate: string; //地理坐标
    pmLongitude: number; //经度
    pmLatitude: number; //纬度
    pmLinkName: string; //联系姓名
    pmLinkPhone: string; //联系电话
    pmCsrPhone: string; //客服电话
    pmEmail: string; //电子邮箱
    pmIntroduce: string; //商户简介
    pmLogo: string; //商户标志
    pmPic1: string; //商户图片1
    pmPic2: string; //商户图片2
    pmPic3: string; //商户图片3
    pmRemark: string; //商户备注
    pmLegalName: string; //法人姓名（个人为个人姓名）
    pmLegalIdNum: string; //工商登记号（个人为身份证号）
    pmCertificatePic1: string; //个人为身份证正面，公司为工商登记证
    pmCertificatePic2: string; //个人为身份证反面
    pmCertificatePic3: string; //证件图片3
    pmCertificatePic4: string; //证件图片4
  };

  type ApplyTabProp = {
    content: MApplay.MerchantExp;
    lsView?: boolean;
    isModify?: boolean;
    form: FormInstance<any>;
    onContentChanged: (content: MApplay.MerchantExp) => void;
  };
}
