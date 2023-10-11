/**
 * 游戏信息
 */
const db = require('../../mysql');
 Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};

//获取游戏信息列表
exports.getGameCategories=(params, callback)=>{
    let { page, _uid } = params;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_order = `order by game_infos.id`;
    let sql_list = `SELECT game_infos.id,g_title,g_type,g_platform,g_version,g_size,use_gem,use_gem_rate,is_first_publish,is_show,game_supplier_id,name as game_supplier,game_infos.created_at  FROM game_infos left join game_suppliers on game_suppliers.id=game_infos.game_supplier_id ${sql_order} ${sql_limit};`;
    let sql_total = `select count(id) as totalNumber from game_infos;`;
    let sql_number = `SELECT game_infos.id,COUNT(game_login_history.user_id) AS game_number  FROM game_infos INNER JOIN game_login_history ON game_infos.id=game_login_history.game_appid GROUP BY game_login_history.game_appid;`;
    let sql_recharge = `SELECT game_infos.id,game_infos.g_title,game_recharge_order.game_id ,game_recharge_order.amount,game_recharge_order.real_amount,game_recharge_order.gem_price,game_recharge_order.order_status,SUM(real_amount) AS game_recharge FROM game_infos INNER JOIN game_recharge_order ON game_infos.id=game_recharge_order.game_id WHERE game_recharge_order.order_status=1 GROUP BY game_recharge_order.game_id;`;
    const game_info_list = [];
    const gamelist = [];
    let gameTotalNumber = 0;
    let gameTotalRecharge = 0;
    db.getArray(sql_list, list => {
        list.map(function (game_info) {
            game_info.game_number = 0;
            game_info.game_recharge = 0;
            game_info_list.push(game_info);
            gamelist.push(game_info.id);
        });
        db.getObject(sql_total, ({ totalNumber }) =>
        {
            //游戏总人数
            db.getArray(sql_number,gameNumberList=>{
                gameNumberList.map(function (game_number_obj) {
                    gameTotalNumber+=game_number_obj.game_number;
                    if(gamelist.contains(game_number_obj.id)){
                        game_info_list.map(function (list_obj) {
                            if(list_obj.id === game_number_obj.id){
                                list_obj.game_number = game_number_obj.game_number;
                            }
                        })
                    }
                });
                //游戏总充值
                db.getArray(sql_recharge,gameRechargeList=>{
                    gameRechargeList.map(function (game_recharge_obj) {
                        gameTotalRecharge+=game_recharge_obj.game_recharge;
                        if(gamelist.contains(game_recharge_obj.id)){
                            game_info_list.map(function (list_obj) {
                                if(list_obj.id === game_recharge_obj.id){
                                    list_obj.game_recharge = game_recharge_obj.game_recharge;
                                }
                            })
                        }
                    });
                    callback({
                        success: true,
                        data: { list:game_info_list,totalNumber,gameTotalNumber,gameTotalRecharge},
                        errorMsg: ""
                    });
                },error => ResponseUtils.resolveError(error, callback));
            },error => ResponseUtils.resolveError(error, callback));
        }, error => ResponseUtils.resolveError(error, callback))
    }, error => ResponseUtils.resolveError(error, callback))
};

//获取单一游戏信息byid
exports.getGameCategorie=(id,callback)=>{
    let strSql=`SELECT * FROM game_infos WHERE id=${id};`;
    db.getObject(strSql,callback);
}

//添加游戏
exports.insertGameCategorie=(data,callback)=>{
    let strSql=`insert into  game_infos(g_title,g_size,g_version,gt_VIP,g_pinyin,g_h5_url,g_type,
    g_platform,game_supplier_id,game_category_id,use_gem_rate,discount,sdw_id,use_gem,company_share_ratio,synopsis,is_show) values(
    '${data.g_title}',${data.g_size},'${data.g_version}','${data.gt_VIP}','${data.gt_pinyin}','${data.g_h5_url}',
    '${data.g_type}',${data.g_platform},${data.game_supplier_id},${data.game_category_id},${data.use_gem_rate},
    ${data.discount},${data.sdw_id},${data.use_gem},${data.company_share_ratio},'${data.synopsis}',${data.is_show});`;
    //游戏是否存在

    let sql_exist = `select a.id from game_infos a where g_title = '${data.g_title}';`;
    db.getObject(sql_exist, existResponse => {
        if (!existResponse) {
            db.query(strSql, createResponse => {
                callback({
                    success: createResponse.affectedRows === 1,
                    data: {},
                    errorMsg: `${createResponse.affectedRows === 1 ? ('游戏' + data.g_title + '创建成功') : ('游戏' + data.g_title + '游戏失败：' + createResponse.message)}`
                });
            })
        } else {
            callback({
                success: false,
                data: {},
                errorMsg: `${data.g_title} 游戏已存在`
            });
        }
    });
    //---------------------------------------------------------------------------
};

//修改游戏类别
exports.updateGameCategorie=(id,name,callback)=>{
    let strSql=`UPDATE game_categories SET name='${name}' WHERE id=${id}`;
    db.query(strSql,callback);
};

//删除游戏信息

exports.delGameCategorie=(id,callback)=>{
    let strSql=`DELETE FROM game_infos WHERE id=${id}`;
    db.query(strSql,callback);
};

//新增游戏类别
exports.addGameCategorie=(name,callback)=>{
    let strSql=`INSERT INTO game_categories(NAME) VALUES('${name}')`;
    db.query(strSql,callback);
};