/**string转Date */
export const string2Date = (dateString: string): Date => {
  return new Date(Date.parse(dateString));
};

/**
 * 格式化时间
 */
export const date2String = (time: Date, format: string) => {
  let timeObj = null;
  if (time == undefined || time == null) return '';
  if (typeof time == 'string') timeObj = new Date(time);
  else timeObj = time;
  let v = '';
  if (!(typeof timeObj.getFullYear === 'function')) {
    return '';
  }
  const year = timeObj.getFullYear();
  const month = timeObj.getMonth() + 1;
  const day = timeObj.getDate();
  const hour = timeObj.getHours();
  const minute = timeObj.getMinutes();
  const second = timeObj.getSeconds();
  const weekDay = timeObj.getDay();
  const ms = timeObj.getMilliseconds();
  let weekDayString = '';

  if (weekDay == 1) {
    weekDayString = '星期一';
  } else if (weekDay == 2) {
    weekDayString = '星期二';
  } else if (weekDay == 3) {
    weekDayString = '星期三';
  } else if (weekDay == 4) {
    weekDayString = '星期四';
  } else if (weekDay == 5) {
    weekDayString = '星期五';
  } else if (weekDay == 6) {
    weekDayString = '星期六';
  } else if (weekDay == 7) {
    weekDayString = '星期日';
  }

  v = format;
  //Year
  v = v.replace(/yyyy/g, year + '');
  v = v.replace(/YYYY/g, year + '');
  v = v.replace(/yy/g, (year + '').substring(2, 4));
  v = v.replace(/YY/g, (year + '').substring(2, 4));

  //Month
  const monthStr = '0' + month;
  v = v.replace(/MM/g, monthStr.substring(monthStr.length - 2));
  //Day
  const dayStr = '0' + day;
  v = v.replace(/DD/g, dayStr.substring(dayStr.length - 2));

  //hour
  const hourStr = '0' + hour;
  v = v.replace(/HH/g, hourStr.substring(hourStr.length - 2));
  v = v.replace(/hh/g, hourStr.substring(hourStr.length - 2));

  //minute
  const minuteStr = '0' + minute;
  v = v.replace(/mm/g, minuteStr.substring(minuteStr.length - 2));

  //Millisecond
  v = v.replace(/sss/g, ms + '');
  v = v.replace(/SSS/g, ms + '');

  //second
  const secondStr = '0' + second;
  v = v.replace(/ss/g, secondStr.substring(secondStr.length - 2));
  v = v.replace(/SS/g, secondStr.substring(secondStr.length - 2));

  //weekDay
  v = v.replace(/E/g, weekDayString);
  return v;
};

/***加指定日期 */
export const dateAdd = (aDate: Date, count: number): Date => {
  const nowDate = new Date(aDate);
  nowDate.setDate(aDate.getDate() + count);
  return nowDate;
};

/***加指定月份 */
export const monthAdd = (aDate: Date, count: number): Date => {
  const nowDate = new Date(aDate);
  nowDate.setMonth(aDate.getMonth() + count);
  return nowDate;
};
