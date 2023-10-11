/**
 * 用户信息
 */

const db = require('../../mysql');
var dataUtils = require('../../utils/DateUtils');
var ResponseUtils = require('../../utils/ResponseUtils');
var Constant = require('../../constant');

// 平台用户量统计
exports.userCount = (params, callback) => {
    let sql_count = `select (select count(a.id) from user a) as userAmounts, (select count(b.id) from user b where b.audit_state = 2) as auUserAmounts;`;
    db.getObject(sql_count, ({ userAmounts, auUserAmounts }) => {
        callback({
            success: true,
            data: { userAmounts, auUserAmounts },
            errorMsg: ""
        })
    })
}

// 近七日用户新增数据
exports.sevenDayUserCounts = (params, callback) => {
    //-- 近七日实名用户总量
    let sql_list = `SELECT
        COUNT( id ) AS counts,
        DATE_FORMAT( ctime, "%Y-%m-%d" ) AS ctime 
    FROM
        user 
    WHERE  SUBDATE( CURRENT_DATE ( ), INTERVAL 7 DAY ) < DATE( ctime ) 
    GROUP BY
        DATE_FORMAT( ctime, "%Y-%m-%d" );`;
    let sql_auth_list = `SELECT
        COUNT( id ) AS counts,
        DATE_FORMAT( ctime, "%Y-%m-%d" ) AS ctime 
    FROM
        user 
    WHERE  SUBDATE( CURRENT_DATE ( ), INTERVAL 7 DAY ) < DATE( ctime ) and audit_state = 2
    GROUP BY
        DATE_FORMAT( ctime, "%Y-%m-%d" );`;

    db.getArray(sql_list, list => {
        db.getArray(sql_auth_list, listAuth => {
            callback({
                success: true,
                data: { list, listAuth },
                errorMsg: ""
            });
        })
    })
}

// 获取用户列表
exports.getUserList = (params, callback) => {
    let { mobile, nickname, userId, status, page, _uid } = params;
    let sql_where = `where a.mobile ${mobile ? '=' + mobile : 'is not null'} and a.name ${nickname ? 'like "%' + nickname + '%"' : 'is not null'} and a.id ${userId ? '=' + userId : 'is not null'} and a.status ${status ? '=' + status : 'is not null'}`;
    let sql_order = `order by createTime desc`;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_list = `select a.mobile, a.id as userId, a.name as nickname, ifnull(a.alipay, '未实名') as alipay, a.inviter_mobile as inviterMobile, c.id as inviterUserId, c.name as inviterNickName, a.gem_num as gem, a.freeze_gem_num as freezeGem, a.level, ifnull(a.golds, 0) as goldFlows, ifnull((select sum(rep) from user_reputations d where d.user_id = a.id and d.enabled = 1), 0) as creditScore, a.status, ifnull(b.balance_normal, 0) as balanceNormal, ifnull(b.balance_lock, 0) as balanceLock, a.ctime as createTime from user a left join user_balance b on a.id = b.user_id left join user c on c.mobile = a.inviter_mobile and a.inviter_mobile != 0 ${sql_where} ${sql_order} ${sql_limit};`;
    let sql_total = `select count(id) as totalNumber from user a ${sql_where};`;
    db.getArray(sql_list, list => {
        db.getObject(sql_total, ({ totalNumber }) => {
            callback({
                success: true,
                data: {
                    list,
                    totalNumber,
                },
                errorMsg: ""
            });
        })
    })
}

// 用户基本信息
exports.getUserStatictics = (params, callback) => {
    let { clientId, _uid } = params;
    let sql_statictics = `select a.name as nickname, a.mobile, a.status, a.avatar_url as avatar, a.uuid, a.gem_num as gemNumber, a.level, a.ctime as createTime, ifnull(a.alipay, '') as alipay, ifnull(b.true_name, '') as realName, ifnull(b.id_num, '') as idCard, ifnull(b.audit_state, '') as auditState, ifnull(c.city, "暂无位置信息") as cityName from user a left join authentication_infos b on b.user_id = a.id left join user_locations c on c.user_id = a.id where a.id = ${clientId};`;
    let sql_banned_where = `where ((a.buyer_uid = ${clientId} and a.buyer_ban = 1) or (a.seller_uid = ${clientId} and a.seller_ban = 1)) and a.entry_order_time >= ${dataUtils.getCurrentMonthFirst()} and a.entry_order_time <= ${dataUtils.getCurrentMonthLast()} `;
    let sql_banned = `select count(a.id) as bannedNumber from coin_trade a ${sql_banned_where};`;
    db.getObject(sql_statictics, responseStatictics => {
        db.getObject(sql_banned, responseBanned => {
            if (!responseBanned) responseBanned = { bannedNumber: 0 };
            callback({
                success: true,
                data: Object.assign(responseStatictics, responseBanned),
                errorMsg: ""
            })
        })
    })
}

// 用户矿机统计信息
exports.getMiningStatictics = (params, callback) => {
    let { clientId, _uid } = params;
    let sql_number = `SELECT (select count(id) from minnings b where b.end_time > ${dataUtils.getCurrentTime()} and b.user_id = ${clientId}) as workingNumber, (select count(id) from minnings c where c.end_time <= ${dataUtils.getCurrentTime()} and c.user_id = ${clientId}) as notWorkingNumber from minnings a where a.user_id = ${clientId} group by a.user_id;`
    let sql_day = `select count(a.id) as collectDays, ifnull(sum(a.num), 0) as collectNumber from gem_minning_records a where a.user_id = ${clientId};`;
    db.getObject(sql_number, numberResponse => {
        if (!numberResponse) numberResponse = { workingNumber: 0, notWorkingNumber: 0 };
        db.getObject(sql_day, dayResponse => {
            if (!dayResponse) dayResponse = { collectDays: 0, collectNumber: 0 };
            callback({
                success: true,
                data: Object.assign(numberResponse, dayResponse),
                errorMsg: ""
            });
        })
    })
}

//用户矿机列表
exports.getMiningList = (params, callback) => {
    let { clientId, status, page, _uid } = params;
    let sql_where = `where a.end_time ${status ? '>' : '<='} ${dataUtils.getCurrentTime()} and a.user_id = ${clientId}`;
    let sql_order = `order by beginTime desc`;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_list = `select a.id, a.minning_id as type, case when a.end_time <= ${dataUtils.getCurrentTime()} then '已过期' else '运行中' end as status, a.source, a.begin_time as beginTime, a.end_time as endTime from minnings a ${sql_where} ${sql_order} ${sql_limit};`;
    let sql_total = `select count(id) as totalNumber from minnings a ${sql_where};`;
    db.getArray(sql_list, list => {
        db.getObject(sql_total, response => {
            if (!response) response = { totalNumber: 0 };
            callback({
                success: true,
                data: Object.assign({ list }, response),
                errorMsg: ""
            });
        })
    })
}

// 获取用户钻石统计信息
exports.getDiamondStatictics = (params, callback) => {
    let { clientId, _uid } = params;
    let sql_statictics = `select a.gem_num as gemNum, a.freeze_gem_num as freezeGemNum from user a where a.id = ${clientId};`;
    db.getObject(sql_statictics, response => {
        callback({
            success: true,
            data: response,
            errorMsg: ""
        });
    })
}

// 用户钻石记录列表
exports.getDiamondList = (params, callback) => {
    let { clientId, page, _uid } = params;
    let sql_where = `where a.user_id = ${clientId}`;
    let sql_order = `order by createTime desc`;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_list = `select a.id, a.num, ifnull(a.description, '') as description, a.gem_source as source, a.created_at as createTime from gem_records a ${sql_where} ${sql_order} ${sql_limit};`;
    let sql_total = `select count(a.id) as totalNumber from gem_records a ${sql_where};`;
    db.getArray(sql_list, list => {
        db.getObject(sql_total, ({ totalNumber }) => {
            callback({
                success: true,
                data: {
                    list,
                    totalNumber,
                },
                errorMsg: ""
            });
        })
    })
}

// 用户分红、提现统计信息
exports.getDividendStatictics = (params, callback) => {
    let { clientId, _uid } = params;
    let sql_statictics = `select ifnull(a.balance_normal, 0) as balanceNormal, ifnull(a.balance_lock, 0) as balanceLock, ifnull((select sum(b.amount) from user_withdraw_history b where b.status = 1 and b.user_id = ${clientId}), 0) as withDrawNumber from user_balance a where user_id = ${clientId};`;
    db.getObject(sql_statictics, response => {
        if (!response) response = { balanceNormal: 0, balanceLock: 0, withDrawNumber: 0 };
        callback({
            success: true,
            data: response,
            errorMsg: ""
        });
    })
}

// 用户分红列表信息
exports.getDividendList = (params, callback) => {
    let { clientId, page, _uid } = params;
    let sql_where = `where a.user_id = ${clientId}`;
    let sql_order = `order by createTime desc`;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_list = `select a.id, a.tag, a.description, a.amount_change as amount, a.created_at as createTime from user_balance_flow a ${sql_where} ${sql_order} ${sql_limit};`;
    let sql_total = `select count(a.id) as totalNumber from user_balance_flow a ${sql_where};`;
    db.getArray(sql_list, list => {
        db.getObject(sql_total, ({ totalNumber }) => {
            callback({
                success: true,
                data: {
                    list,
                    totalNumber,
                },
                errorMsg: ""
            });
        })
    })
}

// 用户分红提现列表信息
exports.getWithDrawList = (params, callback) => {
    let { clientId, page, _uid } = params;
    let sql_where = `where a.user_id = ${clientId}`;
    let sql_order = `order by createTime desc`;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_list = `select a.id, a.withdraw_type as withdrawType, a.withdraw_to as withdrawTo, a.amount, a.content, a.status, a.fail_reason as failReason, a.created_at as createTime from user_withdraw_history a ${sql_where} ${sql_order} ${sql_limit};`;
    let sql_total = `select count(a.id) as totalNumber from user_withdraw_history a ${sql_where};`;
    db.getArray(sql_list, list => {
        db.getObject(sql_total, ({ totalNumber }) => {
            callback({
                success: true,
                data: {
                    list,
                    totalNumber,
                },
                errorMsg: ""
            });
        })
    })
}

// 用户交易统计信息
exports.getTransactionStatictics = (params, callback) => {
    let { clientId, _uid } = params;
    let sql_statictics = `select ifnull((select count(b.id) from coin_trade b where (b.buyer_uid = ${clientId} or b.seller_uid = ${clientId}) and b.status = 0 and b.seller_uid is not null), 0) as inNormalNumber, ifnull((select count(b.id) from coin_trade b where b.buyer_uid = ${clientId} and (b.status = 1 or (b.status = 0 and b.seller_uid is null))), 0) as bullNumber, ifnull((select count(c.id) from coin_trade c where (c.buyer_uid = ${clientId} or c.seller_uid = ${clientId}) and c.status = 4), 0) as completeNumber, ifnull((select sum(d.amount) from coin_trade d where d.buyer_uid = ${clientId} and d.status = 4), 0) as buyAmount, ifnull((select sum(e.amount) from coin_trade e where e.seller_uid = ${clientId} and e.status = 4), 0) as sellAmount, ifnull((select count(a.id) from coin_trade a where (a.buyer_uid = ${clientId} or a.seller_uid = ${clientId}) and (a.status = 2 or a.status = 3 or a.status = 5)),0) as processingNumber from coin_trade a group by a.id;`;
    db.getObject(sql_statictics, statictics => {
    if (!statictics) statictics = { inNormalNumber: 0, bullNumber: 0, completeNumber: 0, buyAmount: 0, sellAmount: 0, processingNumber: 0 };
        callback({
            success: true,
            data: Object.assign(statictics),
            errorMsg: ""
        });
    })
}

// 用户交易列表信息 status 0、买单 1、交易中 2、交易完成
exports.getTransactionList = (params, callback) => {
    let { clientId, status, page, _uid} = params;
    let sql_where = [`where (a.buyer_uid = ${clientId} or a.seller_uid = ${clientId}) and a.status = 0 and a.seller_uid is not null`, `where a.buyer_uid = ${clientId} and (a.status = 1 or (a.status = 0 and a.seller_uid is null))`, `where (a.buyer_uid = ${clientId} or a.seller_uid = ${clientId}) and (a.status = 2 or a.status = 3 or a.status = 5)`, `where (a.buyer_uid = ${clientId} or a.seller_uid = ${clientId}) and a.status = 4`];
    let sql_order = `order by a.status desc, createTime desc`;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_list = `select a.id, a.trade_number as tradeNumber, a.buyer_uid as buyerUid, ifnull(b.name, "") as buyerName, a.buyer_alipay as buyerAlipay, a.seller_uid as sellerUid, ifnull(c.name, "") as sellerName, a.seller_alipay as sellerAlipay, a.amount, a.price, a.total_price as totalPrice, ifnull(a.fee, "--") as fee, a.status, a.picture_url as pictureUrl, a.ctime as createTime, a.entry_order_time as entryOrderTime, a.paid_time as paidTime, a.pay_coin_time as payCoinTime, a.appeal_time as appealTime, a.deal_time as dealTime from coin_trade a left join user b on b.id = a.buyer_uid left join user c on c.id = a.seller_uid ${sql_where[status]} ${sql_order} ${sql_limit};`;
    let sql_total =  `select count(id) as totalNumber from coin_trade a ${sql_where[status]};`;
    db.getArray(sql_list, list => {
        db.getObject(sql_total, ({ totalNumber }) => {
            callback({
                success: true,
                data: {
                    list,
                    totalNumber,
                },
                errorMsg: ""
            });
        })
    })
}

// 用户贡献值统计信息
exports.getContributeStatictics = (params, callback) => {
    let { clientId, _uid } = params;
    // let sql_statictics = `select ifnull(sum(a.num), 0) as contributeValue from gold_flows a where a.user_id = ${clientId};`;
    let sql_statictics = `select ifnull(a.golds, 0) as contributeValue from user a where a.id = ${clientId};`;
    db.getObject(sql_statictics, response => {
        if (!response) response = { contributeValue: 0 };
        callback({
            success: true,
            data: response,
            errorMsg: ""
        });
    })
}

// 用户贡献值列表信息
exports.getContributeList = (params, callback) => {
    let { clientId, page, _uid } = params;
    let sql_where = `where a.user_id = ${clientId}`;
    let sql_order = `order by createTime desc`;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_list = `select a.id, a.discribe as content, a.num as number, a.created_at as createTime from gold_flows a ${sql_where} ${sql_order} ${sql_limit};`;
    let sql_total = `select count(a.id) as totalNumber from gold_flows a ${sql_where};`;
    db.getArray(sql_list, list => {
        db.getObject(sql_total, ({ totalNumber }) => {
            callback({
                success: true,
                data: {
                    list,
                    totalNumber,
                },
                errorMsg: ""
            });
        })
    })
}

// 用户荣誉值统计信息
exports.getHonorStatictics = (params, callback) => {
    let { clientId, _uid } = params;
    let sql_statictics = `select ifnull(sum(a.rep), 0) as honorValue from user_reputations a where a.user_id = ${clientId};`;
    db.getObject(sql_statictics, response => {
        if (!response) response = { honorValue: 0 };
        callback({
            success: true,
            data: response,
            errorMsg: ""
        });
    })
}

// 用户荣誉值列表信息
exports.getHonorList = (params, callback) => {
    let { clientId, page, _uid } = params;
    let sql_where = `where a.user_id = ${clientId}`;
    let sql_order = `order by createTime desc`;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_list = `select a.id, a.rep as number, a.content, a.source, a.created_at as createTime from user_reputations a ${sql_where} ${sql_order} ${sql_limit};`;
    let sql_total = `select count(a.id) as totalNumber from user_reputations a ${sql_where};`;
    db.getArray(sql_list, list => {
        db.getObject(sql_total, ({ totalNumber }) => {
            callback({
                success: true,
                data: {
                    list,
                    totalNumber,
                },
                errorMsg: ""
            });
        })
    })
}

// 用户直推团队统计信息
exports.getRelationStatictics = (params, callback) => {
    let { clientId, _uid } = params;
    let sql_where = `where a.user_id = ${clientId}`;
    let sql_statictics = `select a.star_level as starLevel, a.team_count_sum as teamCount, a.push_count as pushCount, a.push_auth_count as pushAuthCount, a.team_act as teamActivity, a.team_big_act as teamBigActivity, a.team_small_act as teamSmallActivity, a.updated_at as updateTime from user_acts a ${sql_where};`;
    db.getObject(sql_statictics, response => {
        callback({
            success: true,
            data: response,
            errorMsg: ""
        });
    }, error => ResponseUtils.resolveError(error, callback))
}

// 用户直推团队列表信息
exports.getRelationList = (params, callback) => {
    let { clientId, type, page, _uid } = params;

    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_order = `order by createTime desc`;
    let sql_where = [`user a inner join user b on b.mobile = a.inviter_mobile and b.id = ${clientId}`, `user a inner join user b on b.mobile = a.inviter_mobile and b.id = ${clientId} inner join authentication_infos d on d.user_id = a.id and d.audit_state = 2 where a.status = 0`];
    let sql_list = `select a.id, a.name as nickname, a.mobile, a.gem_num as gemNumber, ifnull(a.alipay, "未实名") as alipay, a.ctime as createTime from ${sql_where[type]} ${sql_order} ${sql_limit};`;
    let sql_total = `select count(a.id) as totalNumber from ${sql_where[type]};`;

    db.getArray(sql_list, list => {
        db.getObject(sql_total, ({ totalNumber }) => {
            callback({
                success: true,
                data: {
                    list,
                    totalNumber,
                },
                errorMsg: ""
            });
        })
    })
}

// 用户基础活跃度
exports.getBaseActivityLevel = function (params, callback) {
    let { clientId, _uid } = params;
	let sql = `select id,minning_id from minnings where user_id='${clientId}' and begin_time <= now() and end_time > now()`;
	let act_add = 0;
	db.getArray(sql, res => {
		for (i = 0; i < res.length; i++) {
			let act_item = Constant.minnings[res[i].minning_id].activity_level
			act_add += act_item
        }
        callback({
            success: true,
            data: {
                baseActicity: act_add
            },
            errorMsg: ""
        });
	})
}

// 用户加成活跃度
exports.getAddActivityLevel = function (params, callback) {
    let { clientId, _uid } = params;
	let sql = `select 
	user.id,minning_id 
    from user,minnings,authentication_infos
    right join user b on b.id = ${clientId}
	where user.inviter_mobile = b.mobile
	and minnings.end_time > now()
	and authentication_infos.audit_state = 2
	and user.id=minnings.user_id 
	and user.status = 0
	and user.id = authentication_infos.user_id`;
	let act_add = 0;
	db.getArray(sql, res => {
		for (i = 0; i < res.length; i++)
            act_add += Constant.minnings[res[i].minning_id].activity_level * 0.05
        callback({
            success: true,
            data: {
                addActicity: act_add
            },
            errorMsg: ""
        });
    })
}

// 用户基础活跃度列表
exports.getBaseActivityList = function (params, callback) {
    let { page, clientId, _uid } = params;
    let sql_order = `order by a.created_at desc`;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_list = `select a.id, a.minning_id, a.begin_time as createTime from minnings a where a.user_id='${clientId}' and a.begin_time <= now() and a.end_time > now() ${sql_order} ${sql_limit};`;
    let sql_total = `select count(a.id) as totalNumber from minnings a where user_id='${clientId}' and begin_time <= now() and end_time > now();`;
	db.getArray(sql_list, list => {
        db.getObject(sql_total, ({ totalNumber }) => {
            callback({
                success: true,
                data: {
                    list,
                    totalNumber
                },
                errorMsg: ""
            });
        })
	})
}

// 用户加成活跃度列表
exports.getAddActivityList = function (params, callback) {
    let { page, clientId, _uid } = params;
    let sql_order = `order by minnings.created_at desc`;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_where = `where user.inviter_mobile = b.mobile
        and minnings.end_time > now()
        and authentication_infos.audit_state = 2
        and user.id=minnings.user_id 
        and user.status = 0
        and user.id = authentication_infos.user_id`;
	let sql_list = `select 
        user.id,user.name as nickname,minning_id,minnings.id as minningsRecordId,minnings.created_at as createTime
        from user,minnings,authentication_infos
        right join user b on b.id = ${clientId} ${sql_where} ${sql_order} ${sql_limit}`;
    let sql_total = `select count(minnings.id) as totalNumber
        from user,minnings,authentication_infos
        right join user b on b.id = ${clientId} ${sql_where}`
	db.getArray(sql_list, list => {
        db.getObject(sql_total, ({ totalNumber }) => {
            callback({
                success: true,
                data: {
                    list,
                    totalNumber
                },
                errorMsg: ""
            });
        })
	})
}
    



