/*
 * @Author: fantao.meng 
 * @Date: 2019-05-02 20:39:22 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-11 23:02:00
 */

const Trade = require('../model/trade/CoinTradeModel');

// 交易列表
exports.tradeList = (params, callback) => {
    Trade.tradeList(params, response => callback(response))
}

// 申诉列表
exports.appealList = (params, callback) => {
    Trade.appealList(params, response => callback(response))
}

// 申诉详细信息
exports.appealInfo = (params, callback) => {
    Trade.appealInfo(params, response => callback(response))
}

// 审核申诉订单
exports.submitAppeal = (params, callback) => {
    Trade.submitAppeal(params, response => callback(response))
}