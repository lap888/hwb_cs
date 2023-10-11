const db = require('../../mysql');

//
//-- 钻石总量
exports.gemAllAmounts = (callback) => {
    let sql = `SELECT
	SUM( num ) AS gemAmounts 
FROM
    gem_minning_records;`;
    db.getObject(sql, callback);
}

//-- 当日 新增钻石
exports.gemTodayAmounts = (callback) => {
    let sql = `SELECT
    SUM( num ) AS gemAmounts 
    FROM
    gem_minning_records 
    WHERE
    TO_DAYS( gem_minning_at ) = TO_DAYS( NOW( ) )
    `;
    db.getObject(sql, callback);
}

//-- 近七日钻石消耗 -- 兑换矿机消耗 -- 交易手续费消耗 -- 游戏充值抵扣消耗
exports.sevenDayMinningSubGem = (day=7,callback) => {
    let sql = `SELECT
	SUM( CASE minning_id WHEN 0 THEN 0 WHEN 1 THEN 10 WHEN 2 THEN 100 WHEN 3 THEN 1000 WHEN 4 THEN 10000 WHEN 5 THEN 100000 ELSE 0 END ) AS gems,
	DATE_FORMAT( created_at, "%Y-%m-%d" ) AS ctime 
FROM
	minnings 
WHERE
	SUBDATE( CURRENT_DATE ( ), INTERVAL ${day} DAY ) < DATE( created_at ) 
	AND status = 1 
GROUP BY
    DATE_FORMAT( created_at, "%Y-%m-%d" );`;
    db.getArray(sql, callback);
}

//-- 近七日 交易手续费
exports.sevenDayCoinSubGem = (day=7,callback) => {
    let sql = `SELECT
    SUM( fee ) AS fee,
    DATE_FORMAT( entry_order_time, '%Y-%m-%d' ) AS ctime 
    FROM
    coin_trade 
    WHERE
    status = 4 
    AND SUBDATE( CURRENT_DATE ( ), INTERVAL ${day} DAY ) < DATE( entry_order_time ) 
    GROUP BY
    DATE_FORMAT( entry_order_time, '%Y-%m-%d' );`;
    db.getArray(sql, callback);
}

//-- 近七日 游戏分红 消耗钻石
exports.sevenDayGameSubGem = (day=7,callback) => {
    let sql = `SELECT
	SUM( gem ) as gem,
	DATE_FORMAT( created_at, '%Y-%m-%d' ) AS ctime 
FROM
	order_games 
WHERE
	SUBDATE( CURRENT_DATE ( ), INTERVAL ${day} DAY ) < DATE( created_at ) 
GROUP BY
    DATE_FORMAT( created_at, '%Y-%m-%d' );`;
    db.getArray(sql, callback);
}



