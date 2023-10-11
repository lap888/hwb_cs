/*
 * @Author: fantao.meng 
 * @Date: 2019-03-23 15:42:51 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-03-26 17:51:05
 */
const moment = require('moment');

// 获取当前时间
exports.getCurrentTime = () => {
    var date = new Date();
    return "'" + moment(date).format('YYYY-MM-DD HH:mm') + "'";
}
  
// 获取当前月的第一天
exports.getCurrentMonthFirst = () => {
    var date = new Date();
    date.setDate(1);
    return "'" + moment(date).format('YYYY-MM-DD HH:mm') + "'";
}

// 获取当前月的最后一天
exports.getCurrentMonthLast = () => {
    var date = new Date();
    var currentMonth = date.getMonth();
    var nextMonth = ++currentMonth;
    var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
    var oneDay = 1000*60*60*24;
    return "'" + moment(new Date(nextMonthFirstDay - oneDay)).format('YYYY-MM-DD HH:mm') + "'";
}
