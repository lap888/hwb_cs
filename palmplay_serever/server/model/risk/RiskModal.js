/*
 * @Author: fantao.meng 
 * @Date: 2019-04-24 20:19:46 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-05 17:15:26
 */

const db = require('../../mysql');
const Constant = require('../../constant');
var ResponseUtils = require('../../utils/ResponseUtils');
var DataUtils = require('../../utils/DateUtils');
var moment = require('moment');

// 矿机信息统计
exports.miningList = (params, callback) => {
    let { _uid } = params;
    let sql_count = ``;
    Constant.minnings.map((item, index) => sql_count += `${index === 0 ? "" : ","} (select count(id) from minnings where minning_id = ${item['minning_id']} and end_time > ${DataUtils.getCurrentTime()}) as ${'effectiveCount' + item['minning_id']}, (select count(id) from minnings where minning_id = ${item['minning_id']} and end_time < ${DataUtils.getCurrentTime()}) as ${'invalidCount' + item['minning_id']}`);
    let sql_list = `select ${sql_count} from minnings`;
    db.getObject(sql_list, count => {
        callback({
            success: true,
            data: { count },
            errorMsg: ""
        });
    }, error => ResponseUtils.resolveError(error, callback))
}

// 矿机持有人列表
exports.miningUserList = (params, callback) => {
    let { miningId, status, page, _uid } = params;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_where = `where a.end_time ${status === "0" ? "<" : ">"} ${DataUtils.getCurrentTime()} and a.minning_id = ${miningId}`;
    let sql_order = 'order by a.created_at desc';
    let sql_list = `select a.id, a.minning_id, a.source, a.created_at as createTime, a.end_time as endTime, b.id as userId, b.mobile, b.name as nickName, b.gem_num as gemNumber, ifnull(c.city, "暂无位置信息") as cityName from minnings a right join user b on b.id = a.user_id left join user_locations c on c.user_id = b.id ${sql_where} ${sql_order} ${sql_limit};`;
    let sql_total = `select count(a.id) as totalNumber from minnings a right join user b on b.id = a.user_id ${sql_where};`;
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

// 星级达人信息统计
exports.starList = (params, callback) => {
    let { _uid } = params;
    let sql_count = ``;
    Constant.STAR_LEVEL_DETAILS.map((item, index) => sql_count += `${index === 0 ? "" : ","} (select count(b.id) from user_acts b where star_level = ${item['key']}) as ${'starLevel' + item['key']}`);
    let sql_list = `select ${sql_count} from user_acts;`;
    db.getObject(sql_list, count => {
        callback({
            success: true,
            data: { count },
            errorMsg: ""
        });
    }, error => ResponseUtils.resolveError(error, callback))
}

// 星级达人列表
exports.starUserList = (params, callback) => {
    let { level, page, _uid } = params;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_where = `where a.star_level = ${level} `;
    let sql_list = `select a.id, a.star_level as starLevel, a.team_count_sum as teamCount, a.push_count as pushCount, a.push_auth_count as pushAuthCount, a.team_act as teamActivity, a.team_big_act as teamBigActivity, a.team_small_act as teamSmallActivity, a.updated_at as updateTime, b.id as userId, b.name as nickName, b.mobile, b.gem_num as gemNumber, ifnull(c.city, "暂无位置信息") as cityName from user_acts a right join user b on b.id = a.user_id left join user_locations c on c.user_id = b.id ${sql_where} ${sql_limit};`;
    let sql_total = `select count(a.id) as totalNumber from user_acts a right join user b on b.id = a.user_id ${sql_where};`;
    
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

// 城市信息统计
exports.cityList = (params, callback) => {
    let { page, _uid } = params;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_group = `group by a.city_code`;
    let sql_order = `order by clientAccount desc`;
    let sql_list = `select a.id, a.province, a.province_code as provinceCode, a.city, a.city_code as cityCode, ifnull(count(a.id), 0) as clientAccount from user_locations a ${sql_group} ${sql_order} ${sql_limit};`;
    let sql_total = `select a.id from user_locations a ${sql_group};`;
    db.getArray(sql_list, list => {
        db.getArray(sql_total, (total) => {
            callback({
                success: true,
                data: { list, totalNumber: total.length },
                errorMsg: ""
            });
        }, error => ResponseUtils.resolveError(error, callback))
    }, error => ResponseUtils.resolveError(error, callback))
}

// 创建操作日志
exports.createLog = (params, callback) => {
    let logParams = JSON.parse(params['params']);
    let { _method, _time, _uid  } = logParams;
    let sql_insert = `insert into admin_logs (admin_id, method, params, created_at) values (${_uid}, '${_method}', '${params['params']}', '${moment(_time).format('YYYY-MM-DD HH:mm:ss')}');`;
    db.getObject(sql_insert, response => {
        callback({
            success: true,
            data: response,
            errorMsg: ""
        });
    }, error => ResponseUtils.resolveError(error, callback))
}

// 操作日志列表
exports.logList = (params, callback) => {
    let { nickname, method, page, _uid } = params;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_order = `order by createTime desc`;
    let sql_where = `where (b.nickname ${nickname != "" ? '="' + nickname + '"' : 'is not null or b.nickname is null'}) and (a.method ${method != "" ? 'like "' + method + '.%"' : 'is not null or a.method is null'})`;
    let sql_list = `select a.id, a.method, a.params, b.nickname, a.created_at as createTime, c.role_name as roleName from admin_logs a left join admin_users b on b.id = a.admin_id left join admin_roles c on c.role_id = b.role ${sql_where} ${sql_order};`;
    let sql_total = `select count(a.id) as totalNumber from admin_logs a left join admin_users b on b.id = a.admin_id left join admin_roles c on c.role_id = b.role ${sql_where};`;

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