/**
 * 游戏路由
 */
const GameCategoriesModel = require('../model/games/GameCategoriesModel');
var Game = require('../model/games/GameModal');
var GameInfosModel = require('../model/games/GameInfosModel');

//获取游戏类别信息
exports.getGameCategories = (params, callback) => {
    GameCategoriesModel.getGameCategories(params, response => callback(response))
}

//获取单一游戏类别信息byid
exports.getGameCategorie = (data, callback) => {
    let id = data.id;
    GameCategoriesModel.getGameCategorie(id, result => {
        if (!result) {
            callback({ success: true, data: result });
        } else {
            callback({ success: false, errMsg: '数据为空！' });
        }
    });
}

//修改游戏类别
exports.updateGameCategorie = (data, callback) => {
    let id = data.id;
    let name = data.name;
    GameCategoriesModel.updateGameCategorie(id, name, result => {
        //修改
        if (result.affectedRows == 1 && result.changedRows == 1) {
            callback({ success: true, data: result });
        } else {
            callback({ success: false, errMsg: '修改失败' });
        }
    });
}

//新增游戏类别
exports.addGameCategorie = (data, callback) => {
    let name = data.name;
    GameCategoriesModel.addGameCategorie(name, result => {
        //新增
        if (result.affectedRows == 1 && result.insertId != 0) {
            callback({ success: true, data: result });
        } else {
            callback({ success: false, errMsg: '新增失败' });
        }
    });
}

//删除游戏类别
exports.delGameCategorie = (data, callback) => {
    let id = data.id;
    GameCategoriesModel.delGameCategorie(id, result => {
        if (result.affectedRows == 1) {
            callback({ success: true, data: result });
        } else {
            callback({ success: false, data: result });
        }

    })
}

// 游戏供应商列表
exports.supplierList = (params, callback) => {
    Game.supplierList(params, response => callback(response))
}

// 获取游戏列表
exports.getGameInfosList = (params, callback) => {
    GameInfosModel.getGameCategories(params, response => callback(response))
}

// 新增游戏
exports.insertGameCategorie = (data, callback) => {
    GameInfosModel.insertGameCategorie(data, response => callback(response))
}

//获取游戏人数列表
exports.getGameNumber = (data, callback) => {
    GameInfosModel.getGameNumber(data, response => callback(response))
};