/*
 * @Author: fantao.meng 
 * @Date: 2019-05-02 20:39:11 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-13 10:09:11
 */

var moment = require('moment');
var db = require('../../mysql');
var ResponseUtils = require('../../utils/ResponseUtils');
var DataUtils = require('../../utils/DateUtils');

// 成交订单统计
exports.orderAmounts = (params, callback) => {
    let { _uid } = params;
    let sql_statictics = `select ifnull((select count(a.id) from coin_trade a where a.status = 4), 0) as orderAmounts, ifnull((select sum(b.amount) from coin_trade b where b.status = 4), 0) as orderGemAmounts, ifnull((select sum(c.total_price) from coin_trade c where c.status = 4), 0) as orderPriceAmount;`
    db.getObject(sql_statictics, ({ orderAmounts, orderGemAmounts, orderPriceAmount }) => {
        callback({
            success: true,
            data: { orderAmounts, orderGemAmounts, orderPriceAmount },
            errorMsg: ""
        });
    }, error => ResponseUtils.resolveError(error, callback))
}

// --近七日订单成交量
exports.nearDayOrderAmounts = (day, callback) => {
    let sql = `SELECT
    COUNT(id) AS amounts,
        DATE_FORMAT(entry_order_time, '%Y-%m-%d') AS ctime
    FROM
    coin_trade
    WHERE
        status = 4
    AND SUBDATE(CURRENT_DATE(), INTERVAL ${day} DAY) < DATE(entry_order_time)
    GROUP BY
    DATE_FORMAT(entry_order_time, '%Y-%m-%d');`;
    db.getArray(sql, callback);
}

// --近七日钻石成交数
exports.nearDayGemAmounts = (day, callback) => {
    let sql = `SELECT
    SUM(amount) AS amounts,
        DATE_FORMAT(entry_order_time, '%Y-%m-%d') AS ctime
    FROM
    coin_trade
    WHERE
        status = 4
    AND SUBDATE(CURRENT_DATE(), INTERVAL ${day} DAY) < DATE(entry_order_time)
    GROUP BY
    DATE_FORMAT(entry_order_time, '%Y-%m-%d');`;
    db.getArray(sql, callback);
}

// --近七日钻石平均价格
exports.nearDayGemAvgAmounts = (day, callback) => {
    let sql = `SELECT
    AVG(price) AS amounts,
        DATE_FORMAT(entry_order_time, '%Y-%m-%d') AS ctime
    FROM
    coin_trade
    WHERE
        status = 4
    AND SUBDATE(CURRENT_DATE(), INTERVAL ${day} DAY) < DATE(entry_order_time)
    GROUP BY
    DATE_FORMAT(entry_order_time, '%Y-%m-%d');`;
    db.getArray(sql, callback);
}

// 交易手续费统计
exports.feeAccount = (params, callback) => {
    let sql_count = `select ifnull((select sum(a.fee) from coin_trade a where a.status = 4), 0) as feeAmounts, ifnull((select sum(b.fee) from coin_trade b where b.status = 4 and TO_DAYS(b.ctime) = TO_DAYS(NOW())), 0) as feeTodayAmounts;`;
    db.getObject(sql_count, ({ feeAmounts, feeTodayAmounts }) => {
        callback({
            success: true,
            data: { feeAmounts, feeTodayAmounts },
            errorMsg: ""
        })
    })
}


// 交易列表信息
exports.tradeList = (params, callback) => {
    let { buyerAlipay, sellerAlipay, status, page, _uid} = params;
    let sql_order = `order by createTime desc`;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_where = `where (a.buyer_alipay ${buyerAlipay != "" ? '=' + buyerAlipay : 'is not null or a.buyer_alipay is null'}) and (a.seller_alipay ${sellerAlipay != "" ? '=' + sellerAlipay : 'is not null or a.seller_alipay is null'}) and a.status ${status != "" ? '=' + status : 'is not null'} `;
    let sql_list = `select a.id, a.trade_number as tradeNumber, a.buyer_uid as buyerUid, ifnull(b.name, "") as buyerName, a.buyer_alipay as buyerAlipay, a.seller_uid as sellerUid, ifnull(c.name, "") as sellerName, a.seller_alipay as sellerAlipay, a.amount, a.price, a.total_price as totalPrice, ifnull(a.fee, "--") as fee, a.picture_url as pictureUrl, a.status, a.ctime as createTime, a.entry_order_time as entryOrderTime, a.paid_time as paidTime, a.pay_coin_time as payCoinTime, a.appeal_time as appealTime, a.deal_time as dealTime from coin_trade a left join user b on b.id = a.buyer_uid left join user c on c.id = a.seller_uid ${sql_where} ${sql_order} ${sql_limit};`;
    let sql_total =  `select count(id) as totalNumber from coin_trade a ${sql_where};`;
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
        }, error => ResponseUtils.resolveError(error, callback))
    }, error => ResponseUtils.resolveError(error, callback))
}

// 申诉列表信息
exports.appealList = (params, callback) => {
    let { buyerAlipay, sellerAlipay, status, page, _uid} = params;
    let sql_order = `order by a.status asc, createTime desc`;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_status = [`a.status = 0`, `a.status = 1 and a.appeal_result = 0`, `a.status = 1 and a.appeal_result = 1`];
    let sql_where = `where ${[0, 1, 2].indexOf(status) != -1 ? sql_status[status] : 'a.status is not null'} and (b.buyer_alipay ${buyerAlipay != "" ? '=' + buyerAlipay : 'is not null or b.buyer_alipay is null'}) and (b.seller_alipay ${sellerAlipay != "" ? '=' + sellerAlipay : 'is not null or b.seller_alipay is null'})`;
    let sql_list = `select a.id, a.description, a.created_at as createTime, a.updated_at as updateTime, a.status, ifnull(a.appeal_result, 0) as appealResult, b.buyer_alipay, b.seller_alipay from appeals a left join coin_trade b on b.id = a.order_id ${sql_where} ${sql_order} ${sql_limit};`;
    let sql_total =  `select count(a.id) as totalNumber from appeals a left join coin_trade b on b.id = a.order_id ${sql_where};`;
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
        }, error => ResponseUtils.resolveError(error, callback))
    }, error => ResponseUtils.resolveError(error, callback))
}

// 申诉详细信息
exports.appealInfo = (params, callback) => {
    let { appealId, _uid } = params;
    let sql_object = `select 
        a.id, a.description, a.pic_url as appealPicture, a.created_at as createTime, a.updated_at as updateTime, a.status, a.appeal_result as appealResult, 
        b.trade_number as tradeNumber, b.amount, b.price, b.total_price as totalPrice, b.picture_url as tradePicture, b.fee, b.buyer_uid as buyerUid, b.buyer_alipay as buyerAlipay, b.seller_uid as seller_uid, b.seller_alipay as sellerAlipay, b.entry_order_time as entryOrderTime, b.paid_time as paidTime, b.pay_coin_time as payCoinTime, b.appeal_time as appealTime, b.deal_time as dealTime, 
        c.name as buyerName, c.mobile as buyerMobile, 
        d.name as sellerName, c.mobile as sellerMobile, 
        e.true_name as buyerRealName, 
        f.true_name as sellerRealName 
        from appeals a 
        left join coin_trade b on b.id = a.order_id 
        left join user c on c.id = b.buyer_uid 
        left join user d on d.id = b.seller_uid  
        left join authentication_infos e on e.user_id = c.id 
        left join authentication_infos f on f.user_id = d.id 
        where a.id = ${appealId};`;
    db.getObject(sql_object, orderInfo => {
        callback({
            success: true,
            data: {
                orderInfo
            },
            errorMsg: ""
        });
    }, error => ResponseUtils.resolveError(error, callback))
}

// 审核申诉订单
exports.submitAppeal = (params, callback) => {
    let { appealId, submitStatus, _uid } = params;
    // 订单详情
    let sql_trade = `select b.seller_uid as sellerUid, b.amount, b.fee, c.gem_num as gemNumber, c.freeze_gem_num as freezeGemNumber from appeals a left join coin_trade b on b.id = a.order_id left join user c on c.id = b.seller_uid where a.id = ${appealId} and a.status = 0;`;    
    db.getArray(sql_trade, tradeResponse => {
        // 审核状态更新
        // gem_num = seller.gem_num + coin_trade.amount.to_f + coin_trade.fee.to_f
        // freeze_gem_num = seller.freeze_gem_num - coin_trade.amount.to_f - coin_trade.fee.to_f
        // seller.update(gem_num: gem_num,  freeze_gem_num: freeze_gem_num)
        // NoticeInfo.create(user_id: coin_trade.buyer_uid, content: "您发布的#{coin_trade.amount}钻石买单卖家申诉已通过,买单被撤销", ref_id: coin_trade.id, type: 'trade')
        // NoticeInfo.create(user_id: coin_trade.seller_uid, content: "您好,您的订单申诉已通过,订单已被取消", ref_id: coin_trade.id, type: 'trade')
        // coin_trade.update(status: 0)
        // @appeal.update(appeal_result: true,status: 1)
        
        let sql_update = `update appeals set status = 1, appeal_result = ${submitStatus}, updated_at = '${moment().format("YYYY-MM-DD HH:mm:ss")}' where id = ${appealId};`;

        // if (tradeResponse && tradeResponse[0]) {
        //     let { sellerUid, amount, fee, gemNumber, freezeGemNumber } = tradeResponse[0];
        //     if (submitStatus === 1) {
        //         sql_update = `update appeals a set a.status = 1, a.appeal_result = ${submitStatus}, a.updated_at = '${moment().format("YYYY-MM-DD HH:mm:ss")}' where id = ${appealId};`
        //     }
        //     console.log(tradeResponse);
        //     db.getObject(sql_update, response => {
        //         callback({
        //             success: true,
        //             data: response,
        //             errorMsg: ""
        //         });
        //     }, error => ResponseUtils.resolveError(error, callback))
        // }
    })


}