/**
 * 用户管理模块路由
 */
const AuthenticationInfosModel = require('../model/users/AuthenticationInfosModel');
const utils = require('../utils/Index');
const config = require('../config/constant');
const GoldFlow = require('./GoldFlow');
const User = require('../model/users/UsersModel');

//获取实名人工审核列表
exports.authenticationinfos = (data, callback) => {
	let _data = utils.Response.PageV(data);
	let state = _data.state ? _data.state : -1;
	let mobile = _data.mobile ? _data.mobile : '';
	AuthenticationInfosModel.getAuthenticationInfosDynimc(mobile, state, _data.pageIndex, _data.pageSize, (result) => {
		AuthenticationInfosModel.getTotals(mobile, state, data => {
			console.log('total' + JSON.stringify(data));
			callback(utils.Response.OK(result, _data.pageIndex, _data.pageSize, data.total));
		});
	});
}

//不同意
exports.notAgreeAuthenticationInfo = (data, callback) => {
	let mark = data.mark;
	let id = data.id;
	if (typeof (mark) == 'undefined') {
		callback(utils.Response.Err('请填写失败原因'));
		return;
	}
	if (typeof (id) == 'undefined') {
		callback(utils.Response.Err('用户 id 未获取到'));
		return;
	}
	AuthenticationInfosModel.notAgreeAuthenticationInfo(id, mark, result => {
		if (result.affectedRows > 0) {
			callback(utils.Response.OK(result))
		} else {
			callback(utils.Response.Err('操作失败' + result.message));
		}

	});
}

// 人工审核 通过优化
exports.agreeAuthenticationInfo_2 = (data, callback) => {
	//
	let id = data.id;
	let uId = data.uId;
	if (typeof (id) == 'undefined') {
		callback(utils.Response.Err('用户 id 未获取到'));
		return;
	}
	if (typeof (uId) == 'undefined') {
		callback(utils.Response.Err('用户 id 未获取到'));
		return;
	}
	//获取用户信息
	AuthenticationInfosModel.getUserById_2(uId, userInfo => {
		if (userInfo) {
			// 修改实名用户的会员等级
			let golds = userInfo.golds
			let level = 'lv1'
			if (golds >= 100 && golds < 200) {
				level = 'lv2'
			} else if (golds >= 200 && golds < 2000) {
				level = 'lv3'
			} else if (golds >= 2000 && golds < 5000) {
				level = 'lv4'
			} else if (golds >= 5000) {
				level = 'lv5'
			}
			if (level != 'lv1') {
				AuthenticationInfosModel.updateUserLevel(uId, level)
			}
			// 对于被邀请的用户  找到邀请人  奖励50贡献值
			if (userInfo.inviter_mobile != 0) {
				//通过邀请人手机号获取邀请人信息
				AuthenticationInfosModel.getUserByMobile_3(userInfo.inviter_mobile, inviterUserInfo => {
					if (inviterUserInfo) {
						GoldFlow.addGoldFlow_2('邀请用户奖励', '+50', inviterUserInfo.id, res1 => {
							if (res1.success) {

								AuthenticationInfosModel.addRepRecord(inviterUserInfo.id, 2, `邀请用户【${userInfo.name}】实名，奖励2点荣誉值`, 0)
								AuthenticationInfosModel.addRepRecord(uId, 2, `实名认证，奖励2点荣誉值`, 0)
								// 修改审核表状态
								AuthenticationInfosModel.agreeAuthenticationInfo(id, result => {
									if (result.affectedRows > 0) {
										AuthenticationInfosModel.updateUserAuditState(uId, 2);
										callback(utils.Response.OK(result))
									} else {
										callback(utils.Response.Err('操作失败' + result.message));
									}
								});
							}
						});

					} else {
						//无邀请人 直接同意
						AuthenticationInfosModel.agreeAuthenticationInfo(id, result => {
							if (result.affectedRows > 0) {
								AuthenticationInfosModel.updateUserAuditState(uId, 2);
								callback(utils.Response.OK(result))
							} else {
								callback(utils.Response.Err('操作失败' + result.message));
							}
						});
					}
				});

			} else {
				//无邀请人 直接同意
				AuthenticationInfosModel.agreeAuthenticationInfo(id, result => {
					if (result.affectedRows > 0) {
						AuthenticationInfosModel.updateUserAuditState(uId, 2);
						callback(utils.Response.OK(result))
					} else {
						callback(utils.Response.Err('操作失败' + result.message));
					}
				});
			}

		} else {
			callback(utils.Response.Err('操作失败_该用户不存在_' + `uId:${uId}`));
		}
	});
}

//同意
exports.agreeAuthenticationInfo = (data, callback) => {
	let id = data.id;
	let uId = data.uId;
	if (typeof (id) == 'undefined') {
		callback(utils.Response.Err('用户 id 未获取到'));
		return;
	}
	if (typeof (uId) == 'undefined') {
		callback(utils.Response.Err('用户 id 未获取到'));
		return;
	}
	// 给奖励修改
	AuthenticationInfosModel.getUserById(uId, userRes2 => {
		if (userRes2) {
			// 修改实名用户的会员等级
			let golds = userRes2.golds
			// level = 'lv1'
			if (golds >= 100 && golds < 200) {
				level = 'lv2'
			} else if (golds >= 200 && golds < 2000) {
				level = 'lv3'
			} else if (golds >= 2000 && golds < 5000) {
				level = 'lv4'
			} else if (golds >= 5000) {
				level = 'lv5'
			}
			if (level != 'lv1') {
				AuthenticationInfosModel.updateUserLevel(uId, level)
			}
			// 对于被邀请的用户  找到邀请人  奖励50贡献值
			if (userRes2.inviter_mobile != 0) {
				AuthenticationInfosModel.getUserByMobile(userRes2.inviter_mobile, userRes1 => {
					if (userRes1) {
						GoldFlow.addGoldFlow('邀请用户奖励', '+50', userRes1.id, res1 => {
							if (res1.success) {
								AuthenticationInfosModel.addRepRecord(userRes1.id, 2, `邀请用户【${userRes2.name}】实名，奖励2点荣誉值`, 0)
								// 修改审核表状态
								AuthenticationInfosModel.agreeAuthenticationInfo(id, result => {
									if (result.affectedRows > 0) {

										callback(utils.Response.OK(result))
									} else {
										callback(utils.Response.Err('操作失败' + result.message));
									}
								});
							}
						})
					} else {
						// 修改审核表状态
						AuthenticationInfosModel.agreeAuthenticationInfo(id, result => {
							if (result.affectedRows > 0) {
								callback(utils.Response.OK(result))
							} else {
								callback(utils.Response.Err('操作失败' + result.message));
							}
						});
					}
				})
			} else {
				AuthenticationInfosModel.agreeAuthenticationInfo(id, result => {
					if (result.affectedRows > 0) {
						callback(utils.Response.OK(result))
					} else {
						callback(utils.Response.Err('操作失败' + result.message));
					}
				});
			}

		} else {
			callback(utils.Response.Err('操作失败_该用户不存在_' + `uId:${uId}`));
		}
	});
}

//获取详情
exports.getAuthenticationInfosDetail = (data, callback) => {
	let id = data.id;
	if (typeof (id) == 'undefined') {
		callback(utils.Response.Err('用户 id 未获取到'));
		return;
	}
	AuthenticationInfosModel.getAuthenticationInfosDetail(id, result => {
		if (result.affectedRows > 0 || typeof (result.affectedRows) == 'undefined') {
			var baseUrl = config.constant.apiBase;
			result.pic = baseUrl + result.pic;
			result.pic1 = baseUrl + result.pic1;
			result.pic2 = baseUrl + result.pic2;
			callback(utils.Response.OK(result))
		} else {
			callback(utils.Response.Err('操作失败' + result.message));
		}

	});
}

// 平台用户量统计
exports.userCount = (params, callback) => {
	User.userCount(params, response => callback(response))
}

// 近七日用户新增
exports.sevenDayUserCounts = (params, callback) => {
	User.sevenDayUserCounts(params, response => callback(response))
}

// 获取用户列表
exports.getUserList = (params, callback) => {
	User.getUserList(params, response => callback(response))
}

// 用户基本信息
exports.getUserStatictics = (params, callback) => {
	User.getUserStatictics(params, response => callback(response))
}

// 用户矿机列表
exports.getMiningList = (params, callback) => {
	User.getMiningList(params, response => callback(response))
}

// 用户矿机统计
exports.getMiningStatictics = (params, callback) => {
	User.getMiningStatictics(params, response => callback(response))
}

// 用户钻石记录列表
exports.getDiamondList = (params, callback) => {
	User.getDiamondList(params, response => callback(response))
}

// 用户钻石统计信息
exports.getDiamondStatictics = (params, callback) => {
	User.getDiamondStatictics(params, response => callback(response))
}

// 用户钱包统计信息
exports.getDividendStatictics = (params, callback) => {
	User.getDividendStatictics(params, response => callback(response))
}

// 用户账单列表信息
exports.getDividendList = (params, callback) => {
	User.getDividendList(params, response => callback(response))
}

// 用户钱包提现列表信息
exports.getWithDrawList = (params, callback) => {
	User.getWithDrawList(params, response => callback(response))
}

// 用户交易统计信息
exports.getTransactionStatictics = (params, callback) => {
	User.getTransactionStatictics(params, response => callback(response))
}

// 用户交易列表信息
exports.getTransactionList = (params, callback) => {
	User.getTransactionList(params, response => callback(response))
}

// 用户贡献值统计信息
exports.getContributeStatictics = (params, callback) => {
	User.getContributeStatictics(params, response => callback(response))
}

// 用户贡献值列表信息
exports.getContributeList = (params, callback) => {
	User.getContributeList(params, response => callback(response))
}

// 用户荣誉值统计信息
exports.getHonorStatictics = (params, callback) => {
	User.getHonorStatictics(params, response => callback(response))
}

// 用户荣誉值列表信息
exports.getHonorList = (params, callback) => {
	User.getHonorList(params, response => callback(response))
}

// 用户团队统计信息
exports.getRelationStatictics = (params, callback) => {
	User.getRelationStatictics(params, response => callback(response))
}

// 用户团队列表信息
exports.getRelationList = (params, callback) => {
	User.getRelationList(params, response => callback(response))
}

// 用户基础活跃度统计
exports.getBaseActivityLevel = (params, callback) => {
	User.getBaseActivityLevel(params, response => callback(response))
}

// 用户加成活跃度统计
exports.getAddActivityLevel = (params, callback) => {
	User.getAddActivityLevel(params, response => callback(response))
}

// 用户基础活跃度列表
exports.getBaseActivityList = (params, callback) => {
	User.getBaseActivityList(params, response => callback(response))
}

// 用户加成活跃度列表
exports.getAddActivityList = (params, callback) => {
	User.getAddActivityList(params, response => callback(response))
}

