const UserBalanceModel = require('../model/users/UserBalanceModel');
const utils = require('../utils/Index');

//获取提现记录
exports.userWithDrawInfo = (data, callback) => {
    let _data = utils.Response.PageV(data);
    if (_data.mobile == '' && _data.state == '') {
        UserBalanceModel.UserWithDrawInfoAll(_data.pageIndex, _data.pageSize, result => {
            let _total = 0;
            UserBalanceModel.UserWithDrawTotalAll(userAmount => {
                _total = userAmount.total;
                callback(utils.Response.OK(result, _data.pageIndex, _data.pageSize, _total));
            });
        });

    } else if (_data.mobile == '' && _data.state != '') {
        UserBalanceModel.UserWithDrawInfoByState(_data.state, _data.pageIndex, _data.pageSize, result => {
            let _total = 0;
            UserBalanceModel.UserWithDrawTotalByState(_data.state, userAmount => {
                _total = userAmount.total;
                callback(utils.Response.OK(result, _data.pageIndex, _data.pageSize, _total));
            });
        });

    } else if (_data.mobile != '' && _data.state == '') {
        UserBalanceModel.UserWithDrawInfoByMobile(_data.mobile, _data.pageIndex, _data.pageSize, result => {
            let _total = 0;
            UserBalanceModel.UserWithDrawTotalByPhone(_data.mobile, userAmount => {
                _total = userAmount.total;
                callback(utils.Response.OK(result, _data.pageIndex, _data.pageSize, _total));
            });
        });

    } else {
        //
        UserBalanceModel.UserWithDrawInfoByStateAndPhone(_data.state, _data.mobile, _data.pageIndex, _data.pageSize, result => {
            let _total = 0;
            UserBalanceModel.UserWithDrawTotalByStateAndPhone(_data.state, _data.mobile, userAmount => {
                _total = userAmount.total;
                callback(utils.Response.OK(result, _data.pageIndex, _data.pageSize, _total));
            });
        });
    }
}

//不同意提现
exports.notAgreeWithDrawInfo = (data, callback) => {
    let uId = data.uId;
    let content = data.content;
    let _hId = data.hId;
    if (typeof (uId) == 'undefined' || uId == '') {
        callback(utils.Response.Err('Uid 不能为空!'));
        return;
    }
    if (typeof (content) == 'undefined' || content == '') {
        callback(utils.Response.Err('不同意内容不能为空!'));
        return;
    }
    if (typeof (_hId) == 'undefined' || _hId == '') {
        callback(utils.Response.Err('_hId 不能为空!'));
        return;
    }
    UserBalanceModel.notAgreeUpdateWithDrawHistory(uId, content, result => {
        if (result.affectedRows == 1 && result.changedRows == 1) {
            //查询锁定金额
            UserBalanceModel.findLockMoney(uId, result => {
                if (result) {
                    let balance = result.balance_lock + result.balance_normal;
                    let lock_balance = result.balance_lock;
                    //修改钱包
                    UserBalanceModel.notAgreeModifyUserBalance(uId, balance, result => {
                        //响应
                        if (result.affectedRows == 1) {
                            callback(utils.Response.OK(result));

                        } else {
                            callback(utils.Response.Err('系统错误...105'));
                        }
                    });
                } else {
                    callback(utils.Response.Err('系统错误...102...无此记录'));
                }

            });
        } else {
            callback(utils.Response.Err('系统错误...101...无此记录'));
        }
    });
}

// 修改打款订单号//
exports.updateWithDrawHistory = (data, callback) => {
    let uId = data.uId;
    let hId = data.hId;
    //let amount = data.amounts;
    let alipayId = data.alipayId;
    if (typeof (uId) == 'undefined' || uId == '') {
        callback(utils.Response.Err('Uid 不能为空!'));
        return;
    }
    if (typeof (hId) == 'undefined' || hId == '') {
        callback(utils.Response.Err('hId 不能为空!'));
        return;
    }
    if (typeof (alipayId) == 'undefined' || alipayId == '') {
        callback(utils.Response.Err('alipayId 不能为空!'));
        return;
    }
    UserBalanceModel.agreeUpdateWithDrawHistory_2(hId, alipayId, result => {

        if (result.affectedRows >= 1) {
            callback(utils.Response.OK(result));
        } else {
            callback(utils.Response.Err('系统错误...109...修改打款订单号失败'));
        }
    });
}

//同意提现
exports.agreeWithDraw = (data, callback) => {
    let uId = data.uId;
    let hId = data.hId;
    let amount = data.amounts;

    let withdraw = Math.ceil(amount * 0.97);
    let fee = amount - Math.ceil(amount * 0.97);

    let alipayId = data.alipayId;
    if (typeof (uId) == 'undefined' || uId == '') {
        callback(utils.Response.Err('Uid 不能为空!'));
        return;
    }
    if (typeof (hId) == 'undefined' || hId == '') {
        callback(utils.Response.Err('hId 不能为空!'));
        return;
    }
    if (typeof (alipayId) == 'undefined' || alipayId == '') {
        callback(utils.Response.Err('alipayId 不能为空!'));
        return;
    }
    //更新提现记录
    UserBalanceModel.agreeUpdateWithDrawHistory(uId, alipayId, result => {
        if (result.affectedRows == 1 && result.changedRows == 1) {
            //更新 钱包
            UserBalanceModel.agreeUpdateUserBalance(uId, result => {
                if (result.affectedRows == 1) {
                    //
                    UserBalanceModel.writeFlowInfo(uId, '钱包提现', '钱包提现', `${-withdraw}`, hId, result => {
                        if (result.affectedRows == 1) {
                            callback(utils.Response.OK(result));
                        } else {
                            callback(utils.Response.Err('写入流水失败...105'));
                        }
                    });
                    UserBalanceModel.writeFlowInfo(uId, '提现手续费', '钱包提现', `${-fee}`, hId, result => {
                        if (result.affectedRows == 1) {
                            callback(utils.Response.OK(result));
                        } else {
                            callback(utils.Response.Err('写入流水失败...105'));
                        }
                    });
                    //callback(utils.Response.OK(result));
                } else {
                    callback(utils.Response.Err('系统错误...104'));
                }
            });
        } else {
            callback(utils.Response.Err('系统错误...103...无此记录'));
        }
    });

}