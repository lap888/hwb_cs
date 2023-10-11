/**
 * 钻石模块路由
 */
const Gem = require('../model/gem/GemModel');
const Utils = require('../utils/Index');
//钻石总量
exports.gemAllAmounts = (data, callback) => {
    Gem.gemAllAmounts(result => {
        console.log('钻石总量' + JSON.stringify(result));
        callback(Utils.Response.OK(result));
    });
}

//当日新增钻石
exports.gemTodayAmounts = (data, callback) => {
    Gem.gemTodayAmounts(result => {
        console.log('当日新增钻石' + JSON.stringify(result));
        callback(Utils.Response.OK(result));
    });
}

//兑换矿机消耗钻石
exports.MinningSubGem = (data, callback) => {

    Gem.sevenDayMinningSubGem(7, result => {
        console.log('兑换矿机消耗' + JSON.stringify(result));
        callback(Utils.Response.OK(result));
    });
}

//交易手续费消耗
exports.CoinSubGem = (data, callback) => {
    Gem.sevenDayCoinSubGem(7, result => {
        console.log('交易手续费分红'+JSON.stringify(result));
        callback(Utils.Response.OK(result));
    });
}

//游戏分红消耗
exports.GameSubGem=(data,callback)=>{
    Gem.sevenDayGameSubGem(7,result=>{
        console.log('游戏分红消耗' + JSON.stringify(result));
        callback(Utils.Response.OK(result));
    });

}