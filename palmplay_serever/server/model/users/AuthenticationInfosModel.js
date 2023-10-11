/**
 * 认证信息
 */

const db = require('../../mysql');
const moment = require('moment');
const myself = require('./AuthenticationInfosModel');

//获取记录总条数
exports.getTotal = (lmada = '', callback) => {
    let sql = '';

    if (lmada == '') {
        sql = `SELECT COUNT(id) as total FROM authentication_infos WHERE 1=1 AND auth_type = 1;`;
    } else {
        sql = `SELECT COUNT(id) as total FROM authentication_infos WHERE 1=1 AND auth_type = 1 ${lmada};`;
    }
    db.getObject(sql, callback);

}

//优化获取总条数
exports.getTotals = (mobile = '', state = -1, callback) => {
    let sql = '';
    if (mobile != '' && state == -1) {
        //更具手机号查询
        sql = `SELECT
	COUNT(aui.id) as total 
FROM
	authentication_infos AS aui
	INNER JOIN user
	AS u ON aui.user_id = u.id 
WHERE
    aui.auth_type = 1 AND u.mobile=${mobile};`;
    } else if (mobile == '' && state != -1) {
        sql = `SELECT
        COUNT(aui.id) as total 
    FROM
        authentication_infos AS aui
        INNER JOIN user
        AS u ON aui.user_id = u.id 
    WHERE
        aui.auth_type = 1 AND aui.audit_state=${state};`;
    } else if (mobile != '' && state != -1) {
        sql = `SELECT
        COUNT(aui.id) as total 
    FROM
        authentication_infos AS aui
        INNER JOIN user
        AS u ON aui.user_id = u.id 
    WHERE
        aui.auth_type = 1 AND aui.audit_state=${state} AND u.mobile=${mobile};`;
    } else {
        sql = `SELECT
        COUNT(aui.id) as total 
    FROM
        authentication_infos AS aui
        INNER JOIN user AS u ON aui.user_id = u.id WHERE aui.auth_type = 1;`
    }
    db.getObject(sql, callback);
}

//获取详细信息
exports.getAuthenticationInfosDetail = (id, callback) => {
    let sql = `SELECT
	aui.*,
	u.mobile,
	u.alipay 
FROM
	authentication_infos AS aui
	INNER JOIN user AS u ON aui.user_id = u.id 
WHERE
    aui.id=${id};`;
    db.getObject(sql, callback);
}
// 动态获取条件 拼装 sql 查询数据
exports.getAuthenticationInfosDynimc = (mobile = '', state = -1, pageIndex, pageSize, callback) => {
    let sql = '';
    if (mobile != '' && state == -1) {
        //更具手机号查询
        sql = `SELECT
	aui.*,u.id as userId,u.mobile,u.alipay,u.id as uId 
FROM
	authentication_infos AS aui
	INNER JOIN user
	AS u ON aui.user_id = u.id 
WHERE
    aui.auth_type = 1 AND u.mobile=${mobile} ORDER BY aui.audit_state asc, updated_at DESC LIMIT ${pageIndex},${pageSize};`;
    } else if (mobile == '' && state != -1) {
        sql = `SELECT
        aui.*,u.id as userId,u.mobile,u.alipay,u.id as uId 
    FROM
        authentication_infos AS aui
        INNER JOIN user
        AS u ON aui.user_id = u.id 
    WHERE
        aui.auth_type = 1 AND aui.audit_state=${state} ORDER BY aui.audit_state asc, updated_at DESC LIMIT ${pageIndex},${pageSize};`;
    } else if (mobile != '' && state != -1) {
        sql = `SELECT
        aui.*,u.id as userId,u.mobile,u.alipay,u.id as uId 
    FROM
        authentication_infos AS aui
        INNER JOIN user
        AS u ON aui.user_id = u.id 
    WHERE
        aui.auth_type = 1 AND aui.audit_state=${state} AND u.mobile=${mobile} ORDER BY aui.audit_state asc, updated_at DESC LIMIT ${pageIndex},${pageSize};`;
    } else {
        sql = `SELECT
        aui.*,u.id as userId,
        u.mobile,
        u.alipay,u.id as uId 
    FROM
        authentication_infos AS aui
        INNER JOIN user AS u ON aui.user_id = u.id WHERE aui.auth_type = 1 ORDER BY aui.audit_state asc, updated_at DESC
        LIMIT ${pageIndex},
        ${pageSize};`
    }
    db.getArray(sql, callback);
}

// //获取 人工认证信息by mobile
// exports.getAuthenticationInfoByMobile = (mobile, pageIndex, pageSize, callback) => {
//     let sql = `SELECT
// 	aui.*,u.mobile,u.alipay 
// FROM
// 	authentication_infos AS aui
// 	INNER JOIN user
// 	AS u ON aui.user_id = u.id 
// WHERE
//     aui.auth_type = 1 AND u.mobile=${mobile} LIMIT ${pageIndex},${pageSize};`;
//     db.getArray(sql, callback);
// }
// //获取 人工认证信息 所有
// exports.getAuthenticationInfos = (pageIndex, pageSize, callback) => {
//     let sql = `SELECT
// 	aui.*,
// 	u.mobile,
// 	u.alipay 
// FROM
// 	authentication_infos AS aui
//     INNER JOIN user AS u ON aui.user_id = u.id WHERE aui.auth_type = 1 
//     LIMIT ${pageIndex},
// 	${pageSize};`;
//     db.getArray(sql, callback);
// }
// //获取 人工认证信息 by state
// exports.getAuthenticationInfosByStatus = (state, pageIndex, pageSize, callback) => {
//     let sql = `SELECT
// 	aui.*,u.mobile,u.alipay 
// FROM
// 	authentication_infos AS aui
// 	INNER JOIN user
// 	AS u ON aui.user_id = u.id 
// WHERE
//     aui.auth_type = 1 AND aui.audit_state=${state} LIMIT ${pageIndex},${pageSize};`;
//     db.getArray(sql, callback);
// }



//人工审核通过
exports.agreeAuthenticationInfo = (id, callback) => {
    let sql = `UPDATE authentication_infos 
    SET audit_state = 2,
    updated_at = NOW( ) 
    WHERE
        id = ${id};`;
    console.log("------")
    let sql2 = `select user_id from authentication_infos where id=${id}`;
    //db.getObject(`select user_id from authentication_infos where id=${id}`,res=>{
    db.getObject(sql2, res => {
        console.log(sql2)
        myself.updateUserAuditState(res.user_id, 2);
        db.query(sql, callback);
    })
}
exports.updateUserAuditState = (uId, state) => {
    let sql2 = `update user set audit_state=${state} where id=${uId}`;
    console.log("in update user state")
    console.log(sql2);
    db.query(sql2);
}
//人工审核不同意
exports.notAgreeAuthenticationInfo = (id, mark, callback) => {
    let sql = `UPDATE authentication_infos 
    SET audit_state = 3,
    fail_reason = '${mark}',
    updated_at = NOW( ) 
    WHERE
        id = ${id};`;
    db.getObject(`select user_id from authentication_infos where id=${id}`, res => {
        myself.updateUserAuditState(res.user_id, 3);
        db.query(sql, callback);
    })
}

//x7game-server-授权接口 code

// 获取单个用户信息  通过id  
exports.getUserById = function (uid, callback) {
    let sql = `SELECT u.*, if(sum_rep is null, 0, sum_rep) as creditScore, audit_state, id_num, true_name, team_amount, own_amount, gem_num as gemNum FROM user u left join recharge_statistics r on u.id = r.user_id left join authentication_infos ai on u.id = ai.user_id left join (select sum(rep) as sum_rep, user_id from user_reputations where enabled = 1 and user_id = ${uid}) ur on u.id = ur.user_id WHERE u.id=${uid}`;
    console.log("用户信息", sql)
    db.getObject(sql, callback);
};

//获取用户信息2
exports.getUserById_2 = function (uid, callback) {
    let sql = `SELECT golds,name,inviter_mobile,today_avaiable_golds FROM user WHERE id=${uid};`;
    console.log("用户信息2", sql)
    db.getObject(sql, callback);
};

// 修改用户会员等级
exports.updateUserLevel = function (uid, level) {
    let sql = `update user set level = '${level}' where id = ${uid}`;
    db.query(sql);
}

// 获取单个用户信息  通过手机号
// modify sum(rep) del
exports.getUserByMobile = function (mobile, callback) {
    let sql = `SELECT u.*, if(sum_rep is null, 0, sum_rep) as creditScore, if(audit_state = 2, 2, 0) as audit_state, id_num, true_name, team_amount, own_amount, gem_num as gemNum FROM user u left join recharge_statistics r on u.id = r.user_id left join authentication_infos ai on u.id = ai.user_id left join (select rep as sum_rep,user_id from user_reputations where enabled = 1) ur on ur.user_id = u.id WHERE u.mobile='${mobile}'`;
    db.getObject(sql, callback);
};

//获取用户信息 by mobile 2
exports.getUserByMobile_2 = function (mobile, callback) {
    let sql = `SELECT id,golds,name,inviter_mobile,mobile,today_avaiable_golds FROM user WHERE inviter_mobile=${mobile};`;
    db.getObject(sql, callback);
};

//获取用户信息 by mobile 2
exports.getUserByMobile_3 = function (mobile, callback) {
    let sql = `SELECT id,golds,name,inviter_mobile,mobile,today_avaiable_golds FROM user WHERE mobile=${mobile};`;
    db.getObject(sql, callback);
};

// exports.addRepRecord = function(uid,rep,content,source){
// 	let created_at = moment().format("YYYY-MM-DD HH:mm:ss")
// 	let updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
// 	let sql = `INSERT INTO user_reputations(user_id,rep,content,source,created_at,updated_at) VALUES(${uid},${rep},'${content}',${source},'${created_at}','${updated_at}')`;
// 	// console.log(sql);
// 	db.query(sql);
// }

exports.addRepRecord = function (uid, rep, content, source) {
    let created_at = moment().format("YYYY-MM-DD HH:mm:ss")
    let updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    let sql = `INSERT INTO user_reputations(user_id,rep,content,source,created_at,updated_at) VALUES(${uid},${rep},'${content}',${source},'${created_at}','${updated_at}')`;
    let sum_rep_sql = `select sum(rep) as sum_rep from user_reputations where user_id =${uid};`;
    // console.log(sql);
    db.query(sql, result => {
        db.getObject(sum_rep_sql, result => {
            let sum_rep = typeof (result.sum_rep) == 'undefined' ? 0 : result.sum_rep;
            //更新 user rep
            let update_user_rep = `update user set rep=${sum_rep} where id=${uid};`;
            db.query(update_user_rep);
        });
    });
}

/* 创建gold的流水 */
exports.create = function (discribe, num, uId, callback) {
    let sql = `insert into gold_flows (discribe, num, user_id) values ('${discribe}', '${num}', '${uId}')`;
    db.query(sql, callback);
}

// 修改用户的 gold
exports.updateGolds = function (id, goldNum) {
    let sql = ``;
    if (parseInt(goldNum) == 50) {
        sql = `update user set golds = (golds + '${goldNum}') where id = '${id}'`
    } else {
        sql = `update user set golds = (golds + '${goldNum}'), today_avaiable_golds = (today_avaiable_golds - '${goldNum}') where id = '${id}'`;
    }
    db.query(sql);
}
