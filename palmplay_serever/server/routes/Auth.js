/*
 * @Author: fantao.meng 
 * @Date: 2019-04-01 17:14:13 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-13 18:15:42
 */

var Auth = require('../model/auth/AuthModal');

// 权限校验
exports.checkAuth = (params, callback) => {
	let { _uid } = params;
	callback({
		success: _uid !== 38 && _uid !== 39,
		data: {},
		errorMsg: ""
	});
}

// 管理员登录
exports.login = (params, callback) => {
	Auth.login(params, response => callback(response));
}

// 发送手机验证码
exports.sendVcode = (params, callback) => {
	Auth.sendVcode(params, response => callback(response));
}
