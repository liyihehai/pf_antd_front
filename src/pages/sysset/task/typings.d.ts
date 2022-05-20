declare namespace Task {
  type TaskJob = {
    taskCode: string; //任务代码:不可冲突
    taskName: string; //任务名称
    moduleName: string; //执行任务组件名称
    methodName: string; //执行任务的方法名称
    taskCorn: string; //任务调度时间corn表达式
    param: string; //任务参数: " , "符号分割
    lastExeResult: number; //上次执行结果：0成功，非0存在错误
    lastExpMessage: string; //上次执行结果异常信息
    lastExeTime: number; //上次执行时间
    lastExeTimeLong: number; //上次执行时长
    nextExeTime: number; //下次执行时间
    sumExeTimes: number; //总共执行次数
    sumExeTimeLong: number; //总共执行时长
    avgExeTimeLong: number; //平均执行时长
    taskStatus: number; //0暂停执行，1等待执行，2执行中
  };
  type BeanMethod = {
    beanName: string;
    methodList: string[];
  };
}
