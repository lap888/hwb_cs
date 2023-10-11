/*
 * @Author: top 
 * @Date: 2019-05-11 14:14:16 
 * @Last Modified by: top
 * @Last Modified time: 2019-05-16 22:00:40
 */
const CityAuctionModel = require('../model/city/CityAuctionModel');
const Util = require('../utils/Index');
const moment = require('moment');
exports.addCityAuctionInfo = (data, callback) => {
    let uId = data.uId;
    let cId = data.cId;
    let isShow = data.isShow;
    let auctionEndTime = data.auctionEndTime;
    let ownersEndTime = data.ownersEndTime;
    let openAt = data.openAt;
    let amount = data.amount;
    let realAmount = data.realAmount;
    //let gem = data.gem;
    let gem = ((data.amount - data.realAmount) / 10);
    if (uId == '' || typeof (uId) == 'undefined') {
        callback(Util.Response.Err('uid 不能为空'));
        return;
    }
    if (cId == '' || typeof (cId) == 'undefined') {
        callback(Util.Response.Err('cId 不能为空'));
        return;
    }
    if (isShow == '' || typeof (isShow) == 'undefined') {
        callback(Util.Response.Err('isShow 不能为空'));
        return;
    }
    if (auctionEndTime == '' || typeof (auctionEndTime) == 'undefined') {
        callback(Util.Response.Err('auctionEndTime 不能为空'));
        return;
    }
    if (openAt == '' || typeof (openAt) == 'undefined') {
        callback(Util.Response.Err('openAt 不能为空'));
        return;
    }
    if (amount == '' || typeof (amount) == 'undefined') {
        callback(Util.Response.Err('openAt 不能为空'));
        return;
    }
    if (realAmount == '' || typeof (realAmount) == 'undefined') {
        callback(Util.Response.Err('realAmount 不能为空'));
        return;
    }
    if (gem === '' || typeof (gem) === 'undefined') {
        callback(Util.Response.Err('gem 不能为空'));
        return;
    }

    CityAuctionModel.searchCityAuctionInfo(cId, result => {
        if (result) {
            if (result.count > 0) {
                callback(Util.Response.Err('该城已经存在!'));
                return;
            } else {
                CityAuctionModel.searchCityAuctionInfo2(uId, result => {
                    if (result) {
                        if (result.count > 0) {
                            callback(Util.Response.Err('该城主经存在!'));
                            return;
                        } else {
                            CityAuctionModel.addCityAuctionInfo(uId, cId, isShow, auctionEndTime, ownersEndTime, openAt, amount, realAmount, gem, result => {
                                callback(Util.Response.OK(result));
                            });
                        }
                    } else {
                        CityAuctionModel.addCityAuctionInfo(uId, cId, isShow, auctionEndTime, ownersEndTime, openAt, amount, realAmount, gem, result => {
                            callback(Util.Response.OK(result));
                        });
                    }
                })
            }
        } else {
            CityAuctionModel.addCityAuctionInfo(uId, cId, isShow, auctionEndTime, ownersEndTime, openAt, amount, realAmount, gem, result => {
                callback(Util.Response.OK(result));
            });
        }
    });
}

// 更新 城主信息记录
exports.updateAcutionInfo = (data, callback) => {
    let uId = data.uId;
    let cId = data.cId;
    let isShow = data.isShow;
    let auctionEndTime = data.auctionEndTime;
    let ownersEndTime = data.ownersEndTime;
    let openAt = data.openAt;
    let amount = data.amount;
    let realAmount = data.realAmount;
    let gem = ((data.amount - data.realAmount) / 10);//data.gem;

    let rId = data.rId;//记录 Id
    if (rId == '' || typeof (rId) == 'undefined') {
        callback(Util.Response.Err('rId 不能为空'));
        return;
    }
    if (gem === '' || typeof (gem) === 'undefined') {
        callback(Util.Response.Err('gem 不能为空'));
        return;
    }
    CityAuctionModel.updateAcutionInfo(rId, cId, isShow, auctionEndTime, ownersEndTime, openAt, amount, realAmount, gem, result => {
        callback(Util.Response.OK(result));
    });

}

exports.findCityOwners = (data, callback) => {
    let _data = Util.Response.PageV(data);
    let data2 = {};
    CityAuctionModel.findCityOwnersCount(result => {
        data2.totalNumber = result.totalPage;
        CityAuctionModel.findCityOwners(_data.pageIndex, _data.pageSize, result => {
            data2.list = result;
            callback(Util.Response.OK(data2));
        });
    });
}

//城市详情
exports.cityOwnersDetails = (data, callback) => {
    let uid = data.cOId;
    let _data = {};
    CityAuctionModel.findCityPeoples(uid, result => {
        if (result) {
            _data.totalCount = result.count;
            //
            _data.gemBounds = 0;
            _data.gemTodayBounds = 0;
            _data.gameBounds = 0;
            _data.gameTodayBounds = 0;
            _data.buyCount = 0;
            _data.sellerCount = 0;
            _data.inCome = 0;
            _data.todayIncome = 0;
            _data.inComeRate = 0;
            //
            CityAuctionModel.findCityTodayPeoples(uid, result => {
                if (result) {
                    _data.newCount = result.count;
                    //城市交易量
                    CityAuctionModel.findCityBonus(uid, result => {
                        if (result) {
                            _data.gemBounds = result.gemCount == null ? 0 : result.gemCount;
                            _data.gemTodayBounds = result.todayGemCount == null ? 0 : result.todayGemCount;
                            _data.gameBounds = result.gameBonus == null ? 0 : result.gameBonus;
                            _data.gameTodayBounds = result.todayGameBonus == null ? 0 : result.todayGameBonus;
                            _data.todayIncome = result.todayIncome == null ? 0 : result.todayIncome;
                            _data.inCome = result.inCome == null ? 0 : result.inCome;
                            _data.inComeRate = result.rate == null ? 0 : result.rate;
                            // CityAuctionModel.findCityOwners(uid, result => {
                            //     if (result) {
                            //         let cityId = result.city_id;
                            //         CityAuctionModel.findCoinTrade(cityId, result => {
                            //             if (result) {
                            //                 _data.buyCount = result.buyCount == null ? 0 : result.buyCount;
                            //                 _data.sellerCount = result.sellerCount == null ? 0 : result.sellerCount;
                            //                 callback(Util.Response.OK(_data));
                            //             } else {
                            //                 callback(Util.Response.OK(_data));
                            //             }
                            //         });
                            //     } else {
                            //         callback(Util.Response.OK(_data));
                            //     }
                            // })
                            callback(Util.Response.OK(_data));
                        } else {
                            callback(Util.Response.OK(_data));
                        }
                    });
                    //callback(Util.Response.OK(_data));
                } else {
                    _data.newCount = 0;
                    callback(Util.Response.OK(_data));
                }
            });
        } else {
            _data.totalCount = 0;
            _data.newCount = 0;
            callback(Util.Response.OK(_data));
        }
    });
}

/**
 * 城市游戏分红
 */
exports.cityGameBounsFlow = function (data, callback) {
    let uid = data.cOId;
    let offset = 15 * (parseInt(data.page) - 1 || 0);
    res = {};
    CityAuctionModel.cityGameBounsFlow(uid, offset, UserBalanceFlowRes => {
        CityAuctionModel.cityGameBounsFlowTotalPage(uid, getUserBalanceFlowTotalPageRes => {
            res.totalNumber = 0;
            res.balanceFlow = null;
            if (UserBalanceFlowRes) {
                res.totalNumber = getUserBalanceFlowTotalPageRes.total_page;
                res.balanceFlow = UserBalanceFlowRes;
                callback({ success: true, data: res });
            } else {
                callback({ success: true, data: res });
            }
        })

    });
}

/**
 * 城主附加钻石流水
 */
exports.gemList = function (data, callback) {
    result = {}
    let offset = 15 * (parseInt(data.page) - 1 || 0);
    let uId = data.cOId;

    CityAuctionModel.index2(uId, offset, res => {
        result.gemRecordArr = res
        CityAuctionModel.getUserById(uId, userRes => {
            CityAuctionModel.totalNum2(uId, totalNumRes => {
                result.totalNumber = totalNumRes.total_page
                return_res = { success: true, data: result, timestamp: new Date().getTime(), datatime: moment().format('YYYY-MM-DD HH:mm:ss') }
                console.log("获取钻石记录流水列表", return_res)
                callback(return_res)
            })

        })

    })
}

/**
 * 回报收益流水
 */
exports.cityRewardRecord = (data, callback) => {
    let uid = data.cOId;
    let _data = Util.Response.PageV(data);
    if (uid == '' || typeof (uid) == 'undefined') {
        callback(Util.Response.Err('uid 不能为空!'));
        return;
    }
    let data2 = {};
    CityAuctionModel.findCityRewardRecordCount(uid, result => {
        if (result) {
            data2.totalNumber = result.totalPage;
            CityAuctionModel.findCityRewardRecord(uid, _data.page, _data.pageSize, result => {
                data2.list = result;
                callback(Util.Response.OK(data2));
            });
        } else {
            data2.totalPage = 0;
            data2.list = [];
            callback(data2);
        }
    });
}

