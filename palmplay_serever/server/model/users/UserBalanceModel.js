const db = require('../../mysql');

// 提现展示
exports.UserWithDrawInfo = (phone, pageIndex, pageSize, callback) => {
    let sql = '';
    if (phone == '' || typeof (phone) == 'undefined') {
        sql = `SELECT
            uwh.*,
            u.mobile,
            u.id as userId,
            u.name,
            ub.balance_lock,
            ub.balance_normal
        FROM
            user_withdraw_history AS uwh
            INNER JOIN user AS u ON uwh.user_id = u.id
            INNER JOIN user_balance AS ub ON uwh.user_id = ub.user_id 
        ORDER BY
            updated_at DESC 
            LIMIT ${pageIndex},
            ${pageSize};`;
    } else {
        sql = `SELECT
        uwh.*,
        u.mobile,
        u.id as userId,
        u.name,
        ub.balance_lock,
        ub.balance_normal 
    FROM
        user_withdraw_history AS uwh
        INNER JOIN user AS u ON uwh.user_id = u.id
        INNER JOIN user_balance AS ub ON uwh.user_id = ub.user_id 
    WHERE
        uwh.withdraw_to = ${phone} 
    ORDER BY
        updated_at DESC 
        LIMIT ${pageIndex},
        ${pageSize};`;
    }
    db.getArray(sql, callback);

}

// 单一条件获取 审核信息数据
exports.UserWithDrawInfoByMobile = (phone, pageIndex, pageSize, callback) => {
    let sql = `SELECT
        uwh.*,
        u.mobile,
        u.id as userId,
        u.name,
        ub.balance_lock,
        ub.balance_normal,
        ifnull(b.true_name, "未实名") as realName
    FROM
        user_withdraw_history AS uwh
        INNER JOIN user AS u ON uwh.user_id = u.id
        INNER JOIN user_balance AS ub ON uwh.user_id = ub.user_id 
        LEFT JOIN authentication_infos as b on b.user_id = u.id
    WHERE
        uwh.withdraw_to = ${phone} 
    ORDER BY
        updated_at DESC 
        LIMIT ${pageIndex},
        ${pageSize};`;
    db.getArray(sql, callback);
}
//通过 state 获取审核信息
exports.UserWithDrawInfoByState = (state, pageIndex, pageSize, callback) => {
    let sql = `SELECT
        uwh.*,
        u.mobile,
        u.id as userId,
        u.name,
        ub.balance_lock,
        ub.balance_normal,
        ifnull(b.true_name, "未实名") as realName
    FROM
        user_withdraw_history AS uwh
        INNER JOIN user AS u ON uwh.user_id = u.id
        INNER JOIN user_balance AS ub ON uwh.user_id = ub.user_id 
        LEFT JOIN authentication_infos as b on b.user_id = u.id
    WHERE
        uwh.status = ${state} 
    ORDER BY
        updated_at DESC 
        LIMIT ${pageIndex},
        ${pageSize};`;
    db.getArray(sql, callback);
}
// 双条件
exports.UserWithDrawInfoByStateAndPhone = (state, phone, pageIndex, pageSize, callback) => {
    let sql = `SELECT
        uwh.*,
        u.mobile,
        u.id as userId,
        u.name,
        ub.balance_lock,
        ub.balance_normal,
        ifnull(b.true_name, "未实名") as realName
    FROM
        user_withdraw_history AS uwh
        INNER JOIN user AS u ON uwh.user_id = u.id
        INNER JOIN user_balance AS ub ON uwh.user_id = ub.user_id
        LEFT JOIN authentication_infos as b on b.user_id = u.id
    WHERE
        uwh.status = ${state} AND uwh.withdraw_to=${phone} 
    ORDER BY
        updated_at DESC 
        LIMIT ${pageIndex},
        ${pageSize};`;
    db.getArray(sql, callback);
}
//无条件
exports.UserWithDrawInfoAll = (pageIndex, pageSize, callback) => {
    let sql = `SELECT
    uwh.*,
    u.mobile,
    u.id as userId,
    u.name,
    ub.balance_lock,
    ub.balance_normal,
    ifnull(b.true_name, "未实名") as realName
FROM
    user_withdraw_history AS uwh
    INNER JOIN user AS u ON uwh.user_id = u.id
    INNER JOIN user_balance AS ub ON uwh.user_id = ub.user_id 
    LEFT JOIN authentication_infos as b on b.user_id = u.id
    ORDER BY
    updated_at DESC 
    LIMIT ${pageIndex},
    ${pageSize};`;
    db.getArray(sql, callback);
}
//获取总条数
exports.UserWithDrawTotal = (phone, callback) => {
    let sql = '';
    if (phone == '' || typeof (phone) == 'undefined') {
        sql = `SELECT
            COUNT(uwh.id) AS total FROM
            user_withdraw_history AS uwh
            INNER JOIN user AS u ON uwh.user_id = u.id;`;
    } else {
        sql = `SELECT
            COUNT(uwh.id) AS total FROM
            user_withdraw_history AS uwh
            INNER JOIN user AS u ON uwh.user_id = u.id 
        WHERE
            uwh.withdraw_to = '${phone}';`;
    }
    db.getObject(sql, callback);
}

// 分条件获取分页-by phone
exports.UserWithDrawTotalByPhone = (phone, callback) => {
    let sql = `SELECT
            COUNT(uwh.id) AS total FROM
            user_withdraw_history AS uwh
            INNER JOIN user AS u ON uwh.user_id = u.id 
        WHERE
            uwh.withdraw_to = '${phone}';`;
    db.getObject(sql, callback);
}

//by state get total
exports.UserWithDrawTotalByState=(state,callback)=>{
    let sql = `SELECT
            COUNT(uwh.id) AS total FROM
            user_withdraw_history AS uwh
            INNER JOIN user AS u ON uwh.user_id = u.id 
        WHERE
            uwh.status = '${state}';`;
    db.getObject(sql, callback);
}

//by state and phone get total
exports.UserWithDrawTotalByStateAndPhone=(state,phone,callback)=>{
    let sql = `SELECT
            COUNT(uwh.id) AS total FROM
            user_withdraw_history AS uwh
            INNER JOIN user AS u ON uwh.user_id = u.id 
        WHERE
            uwh.status = '${state}' AND uwh.withdraw_to=${phone};`;
    db.getObject(sql, callback);
}
// get total no where
exports.UserWithDrawTotalAll=(callback)=>{
    let sql = `SELECT
            COUNT(uwh.id) AS total FROM
            user_withdraw_history AS uwh
            INNER JOIN user AS u ON uwh.user_id = u.id;`;
    db.getObject(sql, callback);
}


//同意提现--更新提现记录
exports.agreeUpdateWithDrawHistory = (uid, alipayId, callback) => {
    let sql = `UPDATE user_withdraw_history 
    SET status = 1,order_code=${alipayId},
    updated_at = NOW( ) 
    WHERE
        user_id = '${uid}' 
        AND status = 0;`;
    db.query(sql, callback);
}

// 编辑修改 支付宝单号
exports.agreeUpdateWithDrawHistory_2 = (hid, alipayId, callback) => {
    let sql = `UPDATE user_withdraw_history 
    SET order_code=${alipayId},
    updated_at = NOW( ) 
    WHERE
        id = '${hid}';`;
    db.query(sql, callback);
}


//写入 flow 记录
exports.writeFlowInfo = (uid, tag, desc, amountChange, refId, callback) => {
    let sql = `INSERT INTO user_balance_flow ( user_id, tag, description, amount_change, ref_id )
    VALUES
        ( ${uid}, '${tag}', '${desc}', ${amountChange}, ${refId} );`;
    db.query(sql, callback);
}

//同意体现--更新钱包
exports.agreeUpdateUserBalance = (uid, callback) => {
    let sql = `UPDATE user_balance 
    SET balance_lock = 0 
    WHERE
        user_id = '${uid}';`;
    db.query(sql, callback);
}

//不同意提现 -- 更新提现记录
exports.notAgreeUpdateWithDrawHistory = (uid, content, callback) => {
    let sql = `UPDATE user_withdraw_history 
    SET status = 2,fail_reason='${content}',updated_at = NOW( ) 
    WHERE
        user_id = '${uid}' 
        AND status = 0;`;
    db.query(sql, callback);
}

//不同意提现 -- 查询锁定金额
exports.findLockMoney = (uid, callback) => {
    let sql = `SELECT
	balance_lock,balance_normal 
FROM
	user_balance 
WHERE
    user_id = '${uid}';`;
    db.getObject(sql, callback);
}

//不同意提现--修改钱包
exports.notAgreeModifyUserBalance = (uid, money, callback) => {
    let sql = `UPDATE user_balance 
    SET balance_lock = 0,
    balance_normal = ${money} 
    WHERE
        user_id = '${uid}';`;
    db.query(sql, callback);

}

