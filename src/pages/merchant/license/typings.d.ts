declare namespace License {
    type AppLicense = {
        id: number; //主键ID
        pmCode: string; //商户代码
        pmName: string;//商户名称
        pmShortName: string; //商户简称
        appCode: string; //应用代码
        appName: string;     //应用名称
        moduleCode: string; //模块代码
        moduleName: string;  //模块名称
        mamNo: number; //MAM序号:商户代码+应用代码+模块代码+序号（每次+1）
        moduleVersion: string; //模块版本
        feeType: number; //收费类型:1收费，2试用
        licenseState: number; //License状态:0编辑，1待执行，2执行中，3执行结束，4已终止，-1已删除
        copyCount: number; //拷贝数1<= x <=50
        terminals: string; //终端序列
        startDate: string; //开始日期
        monthCount: number;//月数
        endDate: string; //结束日期
        orderNo: string; //订单号
        exeDate: string; //执行日期
        remainderDays: number; //剩余天数
        licenseAmount: number; //License金额
        exeAmount: number; //已执行金额
        remainderAmount: number; //剩余金额
        createBy: string; //创建人
        createTime: string; //创建时间
        updateBy: string; //更改人
        updateDate: string; //更改时间
        merchantTerminals: string;   //商户终端
    };
}
