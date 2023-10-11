/**
 * 钻石流水
 */
const AuthenticationInfosModel = require('../model/users/AuthenticationInfosModel');
const utils = require('../utils/Index');

/**
 * x7 game 截取代码
 */
// 创建金币流水记录
exports.addGoldFlow = (msg, num, uid, callback) => {
    // 检查用户今日获取金币上限值
    if (parseInt(num) > 0) {
        AuthenticationInfosModel.getUserById(uid, res => {
            if (res) {
                let todayAvaiableGolds = parseInt(res.today_avaiable_golds);
                if (todayAvaiableGolds > 0 || parseInt(num) == 50) {
                    AuthenticationInfosModel.updateGolds(uid, num);
                    AuthenticationInfosModel.create(msg, num, uid, res => {
                        if (res.affectedRows == 1 && res.insertId != 0) {
                            // 获得贡献值   匹配会员等级
                            AuthenticationInfosModel.getUserById(uid, userRes => {
                                if (userRes) {
                                    let golds = userRes.golds
                                    let level = 'lv1'
                                    if (userRes.audit_state == 2) {
                                        if (golds >= 100 && golds < 200) {
                                            level = 'lv2'
                                        } else if (golds >= 200 && golds < 2000) {
                                            level = 'lv3'
                                        } else if (golds >= 2000 && golds < 5000) {
                                            level = 'lv4'
                                        } else if (golds >= 5000) {
                                            level = 'lv5'
                                        }
                                    }
                                    if (level != 'lv1') {
                                        AuthenticationInfosModel.updateUserLevel(uid, level)
                                    }
                                    callback({ success: true })
                                } else {
                                    callback({ success: false, errMsg: "用户不存在" })
                                }
                            })
                        } else {
                            callback({ success: false, errMsg: "创建贡献值流水失败" })
                        }
                    })
                } else {
                    callback({ success: true, data: "今日获取金币数量已达上限" })
                }
            } else {
                callback({ success: false, errMsg: "该用户不存在" })
            }
        })
    } else {
        AuthenticationInfosModel.create(msg, num, uid);
        callback({ success: true })
    }
}


exports.addGoldFlow_2 = (msg, num, uid, callback) => {
    // 检查用户今日获取金币上限值
    if (parseInt(num) > 0) {
        AuthenticationInfosModel.getUserById_2(uid, res => {
            if (res) {
                let todayAvaiableGolds = parseInt(res.today_avaiable_golds);
                if (todayAvaiableGolds > 0 || parseInt(num) == 50) {
                    AuthenticationInfosModel.updateGolds(uid, num);
                    AuthenticationInfosModel.create(msg, num, uid, res => {
                        if (res.affectedRows == 1 && res.insertId != 0) {
                            // 获得贡献值   匹配会员等级
                            AuthenticationInfosModel.getUserById_2(uid, userRes => {
                                if (userRes) {
                                    let golds = userRes.golds
                                    let level = 'lv1'
                                    if (userRes.audit_state == 2) {
                                        if (golds >= 100 && golds < 200) {
                                            level = 'lv2'
                                        } else if (golds >= 200 && golds < 2000) {
                                            level = 'lv3'
                                        } else if (golds >= 2000 && golds < 5000) {
                                            level = 'lv4'
                                        } else if (golds >= 5000) {
                                            level = 'lv5'
                                        }
                                    }
                                    if (level != 'lv1') {
                                        AuthenticationInfosModel.updateUserLevel(uid, level)
                                    }
                                    callback({ success: true })
                                } else {
                                    callback({ success: false, errMsg: "用户不存在" })
                                }
                            })
                        } else {
                            callback({ success: false, errMsg: "创建贡献值流水失败" })
                        }
                    })
                } else {
                    callback({ success: true, data: "今日获取金币数量已达上限" })
                }
            } else {
                callback({ success: false, errMsg: "该用户不存在" })
            }
        })
    } else {
        AuthenticationInfosModel.create(msg, num, uid);
        callback({ success: true })
    }
}