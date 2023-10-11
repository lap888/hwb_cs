/*
 * @Author: fantao.meng 
 * @Date: 2019-04-12 14:53:00 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-16 15:29:22
 */

const App = require('../model/app/AppModal');

// 客户端轮播图
exports.systemBanner = (params, callback) => {
    App.systemBanner(params, response => callback(response))
}

// 游戏列表
exports.likeGameList = (params, callback) => {
    App.likeGameList(params, response => callback(response))
}

// 上传轮播位信息
exports.submmitBanner = (params, callback) => {
    App.submmitBanner(params, response => callback(response))
}

// 上、下线轮播位信息
exports.onlineBanner = (params, callback) => {
    App.onlineBanner(params, response => callback(response))
}

// 编辑轮播位信息
exports.updateBanner = (params, callback) => {
    App.updateBanner(params, response => callback(response))
}

// 城市列表模糊查询
exports.likeCityList = (params, callback) => {
    App.likeCityList(params, response => callback(response))
}

// 用户列表模糊查询
exports.likeOwnerList = (params, callback) => {
    App.likeOwnerList(params, response => callback(response))
}