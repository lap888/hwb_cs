/*
 * @Author: fantao.meng 
 * @Date: 2019-04-27 13:23:34 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-04-29 20:52:08
 */

const db = require('../../mysql');
var ResponseUtils = require('../../utils/ResponseUtils');

// 游戏供应商
exports.supplierList = (params, callback) => {
    let { page, _uid } = params;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_order = `order by onlineGameCount desc`;
    let sql_list = `select a.id as supplierId, a.name as supplierName, a.is_enable as isEnable, a.created_at as createTime, ifnull((select count(b.id) from game_infos b where b.game_supplier_id = a.id and b.is_show = 1), 0) as onlineGameCount, ifnull((select count(b.id) from game_infos b where b.game_supplier_id = a.id and b.is_show = 0), 0) as offlineGameCount from game_suppliers a ${sql_order};`;
    let sql_total = `select count(a.id) as totalNumber from game_suppliers a;`;
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

// 游戏供应商
exports.supplierListV2 = (params, callback) => {
    let { page, _uid } = params;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_order = `order by onlineGameCount desc`;
    let sql_list = `select a.id as supplierId, a.name as supplierName, a.is_enable as isEnable, a.created_at as createTime, ifnull((select count(b.id) from game_infos b where b.game_supplier_id = a.id and b.is_show = 1), 0) as onlineGameCount, ifnull((select count(b.id) from game_infos b where b.game_supplier_id = a.id and b.is_show = 0), 0) as offlineGameCount from game_suppliers a ${sql_order} ${sql_limit};`;
    let sql_total = `select count(a.id) as totalNumber from game_suppliers a;`;
    
    console.log(sql_list);
    console.log(sql_total);

    db.getArray(sql_list, list => {
        console.log(list);
        db.getObject(sql_total, ({ totalNumber }) => {
            console.log(totalNumber);
            callback({
                success: true,
                data: { list, totalNumber },
                errorMsg: ""
            });
        }, error => ResponseUtils.resolveError(error, callback))
    }, error => ResponseUtils.resolveError(error, callback))
}