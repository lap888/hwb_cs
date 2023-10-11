/*
 * @Author: fantao.meng 
 * @Date: 2019-04-12 14:52:33 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-16 17:35:54
 */

const db = require('../../mysql');
var ResponseUtils = require('../../utils/ResponseUtils');

// 获取轮播图列表
exports.systemBanner = (params, callback) => {
    let { page, source, status, _uid } = params;

    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_where = `a.source = ${source} ${status !== undefined ? 'and status = ' + status : ''}`;
    let sql_order = 'order by a.status desc, a.queue asc';
    let sql_list = `select a.id, a.queue, a.title, a.imageurl, a.source, a.params, a.status, a.created_at as createTime from sys_banner a where ${sql_where} ${sql_order} ${sql_limit};`;
    let sql_total = `select count(a.id) as totalNumber from sys_banner a where ${sql_where};`;
    db.getArray(sql_list, list => {
        db.getObject(sql_total, ({ totalNumber }) => {
            callback({
                success: true,
                data: { list, totalNumber },
                errorMsg: ""
            });
        })
    })
}

// 游戏列表
exports.likeGameList = (params, callback) => {
    let { searchText, _uid } = params;
    let sql_list = `select a.id as value, a.g_title as text from game_infos a where a.g_title like '%${searchText}%';`;
    db.getArray(sql_list, list => {
        callback({
            success: true,
            data: { list },
            errorMsg: ""
        });
    })
}

// 上传轮播位信息
exports.submmitBanner = (data, callback) => {
    let { title, imageUrl, queue, source, params, _uid } = data;
    let sql_insert = `insert into sys_banner (title, imageurl, source, queue, params, type, status) values ('${title}', '${imageUrl}', ${source}, ${queue}, '${params}', 1, 0);`;
    db.query(sql_insert, insertResponse => {
        callback({
            success: true,
            data: { insertResponse },
            errorMsg: ""
        });
    }, error => ResponseUtils.resolveError(error, callback))
}

// 上、下线轮播位信息
exports.onlineBanner = (params, callback) => {
    let { bannerId, status, _uid } = params;
    let sql_update = `update sys_banner a set a.status = ${status} where a.id = ${bannerId};`;
    db.query(sql_update, response => {
        callback({
            success: true,
            data: { response },
            errorMsg: ""
        });
    }, error => ResponseUtils.resolveError(error, callback))
}

// 编辑轮播位信息
exports.updateBanner = (data, callback) => {
    let { bannerId, title, imageUrl, queue, source, params, _uid } = data;
    let sql_update = `update sys_banner a set a.title = '${title}', a.imageurl = '${imageUrl}', a.source = ${source}, a.queue = ${queue}, a.params = '${params}' where a.id = ${bannerId};`;
    db.query(sql_update, response => {
        callback({
            success: true,
            data: { response },
            errorMsg: ""
        });
    }, error => ResponseUtils.resolveError(error, callback))
}

// 城市列表模糊查询
exports.likeCityList = (params, callback) => {
    let { searchText, _uid } = params;
    let sql_list = `select a.id as value, a.city_name as text from geo_dictionarys a where a.city_name like '%${searchText}%';`;
    db.getArray(sql_list, list => {
        callback({
            success: true,
            data: { list },
            errorMsg: ""
        });
    })
}

// 用户列表模糊查询
exports.likeOwnerList = (params, callback) => {
    let { searchText, _uid } = params;
    let sql_list = `select a.id as value, concat("【", b.true_name, "】", a.mobile) as text from user a left join authentication_infos b on b.user_id = a.id where a.mobile like '%${searchText}%';`;
    db.getArray(sql_list, list => {
        callback({
            success: true,
            data: { list },
            errorMsg: ""
        });
    })
}
