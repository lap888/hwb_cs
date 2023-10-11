/**
 * 订单管理路由
 */
const CoinTradeModel = require('../model/trade/CoinTradeModel');
const utils = require('../utils/Index');

// 成交订单统计
exports.orderAmounts = (params, callback) => {
	CoinTradeModel.orderAmounts(params, response => callback(response))
}

// 近七日订单成交量
exports.nearDayOrderAmounts = (data, callback) => {
    let day = data.day;
    if (typeof (day) == 'undefined') {
        callback(utils.Response.Err('查询日期不能为空'));
        return;
    }
    CoinTradeModel.nearDayOrderAmounts(day, result => {
        callback(utils.Response.OK(result));
    });
}

// 近七日钻石成交数
exports.nearDayGemAmounts = (data, callback) => {
    let day = data.day;
    if (typeof (day) == 'undefined') {
        callback(utils.Response.Err('查询日期不能为空'));
        return;
    }
    CoinTradeModel.nearDayGemAmounts(day, result => {
        callback(utils.Response.OK(result));
    });
}

// 近七日钻石平均价格
exports.nearDayGemAvgAmounts = (data, callback) => {
    let day = data.day;
    if (typeof (day) == 'undefined') {
        callback(utils.Response.Err('查询日期不能为空'));
        return;
    }
    CoinTradeModel.nearDayGemAvgAmounts(day, result => {
        callback(utils.Response.OK(result));
    });
}

// 交易手续费统计
exports.feeAccount = (params, callback) => {
	CoinTradeModel.feeAccount(params, response => callback(response))
}