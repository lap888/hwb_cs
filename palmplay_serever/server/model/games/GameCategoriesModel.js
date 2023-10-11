/*
 * @Author: fantao.meng 
 * @Date: 2019-04-27 13:58:17 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-04-27 14:31:59
 */

var db = require('../../mysql');
var ResponseUtils = require('../../utils/ResponseUtils');

//获取游戏类别列表
exports.getGameCategories = (params, callback) => {
    let { page, _uid } = params;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_order = `order by onlineGameCount desc`;
    let sql_list = `select a.id, a.name, a.created_at, ifnull((select count(b.id) from game_infos b where b.game_category_id = a.id and b.is_show = 1), 0) as onlineGameCount, ifnull((select count(c.id) from game_infos c where c.game_category_id = a.id and c.is_show = 0), 0) as offlineGameCount from game_categories a ${sql_order};`;
    let sql_total = `select count(a.id) as totalNumber from game_categories a;`;
    
    db.getArray(sql_list, list => {
        db.getObject(sql_total, ({ totalNumber }) => {
            callback({
                success: true,
                data: { list, totalNumber },
                errorMsg: ""
            });
        }, error => ResponseUtils.resolveError(error, callback))
    }, error => ResponseUtils.resolveError(error, callback))
}

//获取单一游戏类别信息byid
exports.getGameCategorie=(id,callback)=>{
    let strSql=`SELECT * FROM game_categories where id=${id};`
    db.getObject(strSql,callback);
}

//修改游戏类别
exports.updateGameCategorie=(id,name,callback)=>{
    let strSql=`UPDATE game_categories SET name='${name}' WHERE id=${id}`;
    db.query(strSql,callback);
}

//删除游戏类别

exports.delGameCategorie=(id,callback)=>{
    let strSql=`DELETE FROM game_categories WHERE id=${id}`;
    db.query(strSql,callback);
}

//新增游戏类别
exports.addGameCategorie=(name,callback)=>{
    let strSql=`INSERT INTO game_categories(NAME) VALUES('${name}')`;
    db.query(strSql,callback);
}