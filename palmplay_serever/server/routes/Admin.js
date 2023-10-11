/*
 * @Author: fantao.meng 
 * @Date: 2019-04-02 16:36:00 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-03 21:33:30
 */

const Admin = require('../model/admin/AdminModal');

// 用户管理员列表
exports.getAdminList = (params, callback) => {
	Admin.getAdminList(params, response => callback(response))
}

// 管理员角色列表
exports.getRoleList = (params, callback) => {
	Admin.getRoleList(params, response => callback(response))
}

// 创建管理员
exports.createAdmin = (params, callback) => {
	Admin.createAdmin(params, response => callback(response))
}

// 角色列表
exports.getRoleList = (params, callback) => {
	Admin.getRoleList(params, response => callback(response))
}

// 权限列表
exports.getRightList = (params, callback) => {
	Admin.getRightList(params, response => callback(response))
}

// 角色权限列表
exports.getRoleRightList = (params, callback) => {
	Admin.getRoleRightList(params, response => callback(response))
}

// 编辑角色权限
exports.operateRoleRight = (params, callback) => {
	Admin.operateRoleRight(params, response => callback(response))
}




