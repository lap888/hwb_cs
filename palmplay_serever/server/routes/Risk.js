/*
 * @Author: fantao.meng 
 * @Date: 2019-04-24 20:19:58 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-03 21:01:21
 */

const Risk = require('../model/risk/RiskModal');

// 矿机信息统计
exports.miningList = (params, callback) => {
    Risk.miningList(params, response => callback(response))
}

// 矿机持有人列表
exports.miningUserList = (params, callback) => {
    Risk.miningUserList(params, response => callback(response))
}

// 星级达人信息统计
exports.starList = (params, callback) => {
    Risk.starList(params, response => callback(response))
}

// 星级达人列表
exports.starUserList = (params, callback) => {
    Risk.starUserList(params, response => callback(response))
}

// 城市信息统计
exports.cityList = (params, callback) => {
    Risk.cityList(params, response => callback(response))
}

// 操作日志列表
exports.logList = (params, callback) => {
    Risk.logList(params, response => callback(response))
}

// 创建操作日志
exports.createLog = (params, callback) => {
    Risk.createLog(params, response => callback(response))
}