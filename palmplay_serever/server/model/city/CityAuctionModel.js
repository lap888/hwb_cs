/*
 * @Author: top 
 * @Date: 2019-05-11 14:16:29 
 * @Last Modified by: top
 * @Last Modified time: 2019-05-16 21:29:44
 */
const db = require('../../mysql');

exports.findCityTodayPeoples = (uid, callback) => {
    let sql = `select count(1) count from user_locations where city_code in (select ul.city_code from user u left join user_locations ul on u.id=ul.user_id where ul.user_id=${uid}) and TO_DAYS(updated_at)=TO_DAYS(now());`;
    db.getObject(sql, callback);
}

// exports.findCityRewardRecord = (uid, pageIndex, pageSize, callback) => {
//     let sql = `select crr.id,crr.user_id userId,crr.city_id cityId,crr.gem,crr.avg_price avgPrice,crr.gem_amount gemAmount,crr.game_bonus gameBonus,crr.created_at createdAt,crr.updated_at updatedAt,acr.amount cityAmount from city_reward_records crr left join city_auction_records acr on crr.user_id=acr.user_id  where crr.user_id=${uid} limit ${pageIndex},${pageSize};`;
//     db.getArray(sql, callback);
// }
exports.findCityRewardRecord = (uid, pageIndex, pageSize, callback) => {
    let sql = `select crr.id,crr.user_id userId,crr.city_id cityId,crr.gem,crr.avg_price avgPrice,crr.amount gemAmount,crr.content gameBonus,crr.created_at createdAt,crr.updated_at updatedAt,acr.amount cityAmount,crr.source from city_reward_records crr left join city_auction_records acr on crr.user_id=acr.user_id  where crr.user_id=${uid} limit ${pageIndex},${pageSize};`;
    db.getArray(sql, callback);
}
exports.findCityRewardRecordCount = (uid, callback) => {
    let sql = `select count(1) as totalPage from city_reward_records crr left join city_auction_records acr on crr.user_id=acr.user_id  where crr.user_id=${uid};`;
    db.getObject(sql, callback);
}

exports.totalNum2 = function (uId, callback) {
    let sql = `select count(1) as total_page from gem_records where user_id = ${uId} and (gem_source=20 or gem_source=21 or gem_source=22);`;
    db.getObject(sql, callback)
}

// 获取单个用户信息  通过id  
exports.getUserById = function (uid, callback) {
    let sql = `SELECT id,ctime,trade_pwd,today_avaiable_golds,password_salt,password,name,mobile,status,avatar_url,golds,inviter_mobile,uuid,gem_minning_at,level,alipay,freeze_gem_num,audit_state,gem_num,gem_num as gemNum FROM user  WHERE id=${uid}`;
    // console.log("用户信息", sql)
    db.getObject(sql, callback);
};

exports.index2 = function (uId, offset, callback) {
    let sql = `select * from gem_records where user_id = ${uId} and (gem_source=20 or gem_source=21 or gem_source=22) order by id desc limit 15 offset ${offset}`;
    db.getArray(sql, callback);
}

exports.cityGameBounsFlowTotalPage = function (uid, callback) {
    let sql = `select count(1) as total_page from user_balance_flow where user_id=${uid} and is_bonus_city=1`;
    db.getObject(sql, callback)
}

exports.cityGameBounsFlow = function (uid, offset, callback) {
    let sql = `SELECT id,tag,description,amount_change,created_at,updated_at FROM user_balance_flow WHERE user_id=${uid} and is_bonus_city=1 ORDER BY id DESC limit 15 offset ${offset} `;
    db.getArray(sql, callback)
}

//获取城市交易量
exports.findCoinTrade = (cityId, callback) => {
    let buyerSql = `select sum(amount) buyCount from coin_trade where status=4 and buyer_uid in (select user_id from user_locations where city_code in (select city_code from geo_dictionarys where id=${cityId}));`
    let sellerSql = `select sum(amount) sellerCount from coin_trade where status=4 and seller_uid in (select user_id from user_locations where city_code in (select city_code from geo_dictionarys where id=${cityId}));`
    let data = {};
    db.getObject(buyerSql, result => {
        if (result) {
            data.buyCount = result.buyCount;
            db.getObject(sellerSql, result => {
                if (result) {
                    data.sellerCount = result.sellerCount;
                    callback(data);
                } else {
                    data.sellerCount = 0;
                    callback(data);
                }
            });
        } else {
            data.buyCount = 0;
            data.sellerCount = 0;
            callback(data);
        }
    });
}

// //获取城主信息
// exports.findCityOwners = (uId, callback) => {
//     console.log(1);
//     let sql = `select city_id,user_id from city_auction_records where id in (select max(id) id from city_auction_records a group by city_id  order by id) and user_id=${uId};`;
//     console.log(sql);
//     db.getObject(sql, callback);
// }

/**
 * 游戏分红/钻石分红
 */
exports.findCityBonus = (uid, callback) => {
    let data = {};
    let sql = `select sum(bonus_amount) gameBonus from user_game_bonus_detail where user_id=${uid} and is_bonus_city=1;`;
    let todayGameBonusSql = `select sum(bonus_amount) todayGameBonus from user_game_bonus_detail where user_id=${uid} and is_bonus_city=1 and TO_DAYS(created_at)=TO_DAYS(now());`
    let gemCountSql = `select sum(num) gemCount from gem_records where user_id=${uid} and (gem_source=20 or gem_source=21 or gem_source=22);`;
    let todayGemCountSql = `select sum(num) todayGemCount from gem_records where user_id=${uid} and (gem_source=20 or gem_source=21 or gem_source=22) and TO_DAYS(created_at)=TO_DAYS(now());`;
    //收益 收益率 今日收益
    let inCome = `select sum(crr.gem) gemSumAmount,acr.amount,(acr.amount) rate from city_reward_records crr left join city_auction_records acr on crr.user_id=acr.user_id  where crr.user_id=${uid};`;
    let todayIncome = `select sum(crr.gem) todayGemSumAmount,acr.amount todayAmount,(acr.amount) rate from city_reward_records crr left join city_auction_records acr on crr.user_id=acr.user_id  where crr.user_id=${uid} and TO_DAYS(crr.created_at)=TO_DAYS(now());`;
    db.getObject(sql, result => {
        let gameBonus = result.gameBonus;
        data.gameBonus = gameBonus;
        db.getObject(todayGameBonusSql, result => {
            let todayGameBonus = result.todayGameBonus;
            data.todayGameBonus = todayGameBonus;
            db.getObject(gemCountSql, result => {
                let gemCount = result.gemCount;
                data.gemCount = gemCount;
                db.getObject(todayGemCountSql, result => {
                    let todayGemCount = result.todayGemCount;
                    data.todayGemCount = todayGemCount;
                    db.getObject(inCome, result => {
                        let inCome = result.gemSumAmount;
                        let rate = result.rate;
                        data.inCome = inCome;
                        data.rate = rate;
                        db.getObject(todayIncome, result => {
                            let todayIncome = result.todayGemSumAmount;
                            data.todayIncome = todayIncome;
                            callback(data);
                        });
                    });
                });
            });
        });
    });
}

exports.findCityPeoples = (uid, callback) => {
    let sql = `select count(1) count from user_locations where city_code in (select ul.city_code from user u left join user_locations ul on u.id=ul.user_id where ul.user_id=${uid});`;
    db.getObject(sql, callback);
}

exports.addCityAuctionInfo = (uId, cId, isShow, auctionEndTime, ownersEndTime, openAt, amount, realAmount, gem, callback) => {
    let city_auctions_sql = `insert into city_auctions(city_id,is_show,status,auction_end_time,owners_end_time,open_at) values(${cId},${isShow},1,'${auctionEndTime}','${ownersEndTime}','${openAt}');`;
    let city_auction_records_sql = `insert into city_auction_records(user_id,city_id,amount,real_amount,gem) values(${uId},${cId},${amount},${realAmount},${gem});`;
    db.query(city_auctions_sql, result => {
        db.query(city_auction_records_sql, result => {
            callback(result);
        })
    });
}

exports.searchCityAuctionInfo = (cId, callback) => {
    //查询城市
    let s_sql = `select count(1) count from city_auctions where city_id=${cId};`;
    db.getObject(s_sql, callback);
}
exports.searchCityAuctionInfo2 = (uId, callback) => {
    //查询城市
    let s_sql = `select count(1) count from city_auction_records where user_id=${uId};`;
    db.getObject(s_sql, callback);
}

//修改城市信息
//修改尘世竞拍记录
exports.updateAcutionInfo = (rId, cId, isShow, auctionEndTime, ownersEndTime, openAt, amount, realAmount, gem, callback) => {
    let city_auctions_sql = `update city_auctions set is_show=${isShow},auction_end_time='${auctionEndTime}',open_at='${openAt}',owners_end_time='${ownersEndTime}',updated_at=now() where city_id=${cId};`;
    let city_auction_records_sql = `update city_auction_records set amount=${amount},real_amount=${realAmount},gem=${gem},updated_at=now() where id=${rId};`;
    db.query(city_auctions_sql, result => {
        db.query(city_auction_records_sql, result => {
            callback(result);
        })
    });
}

exports.findCityOwners = (pageIndex, pageSize, callback) => {
    // let sql = `select a.id,a.name,a.avatar_url avatarUrl,a.amount,a.city_id cityId,a.real_amount realAmount,a.gem,a.auction_end_time auctionEndTime,a.open_at openAt,a.owners_end_time ownersEndTime,geo.city_name cityName from 
    // (select u.*,r.amount,r.city_id,r.real_amount,r.gem,r.auction_end_time,r.open_at,r.owners_end_time from 
    // (select car.user_id,car.city_id,car.amount,car.real_amount,car.gem,ca.auction_end_time,ca.open_at,ca.owners_end_time from (select user_id,city_id,amount,real_amount,gem from city_auction_records where id in (select max(id) from city_auction_records group by city_id)) car left join city_auctions ca on car.city_id=ca.city_id) r left join 

    // (select id,mobile,name,avatar_url from user where id in (select user_id from city_auction_records where id in (select max(id) from city_auction_records group by city_id))) u on r.user_id=u.id) a left join geo_dictionarys geo on geo.id=a.city_id limit ${pageIndex},${pageSize}`;
    let sql = `select a.id,a.rId,a.name,a.avatar_url avatarUrl,a.amount,a.city_id cityId,a.real_amount realAmount,a.gem,a.auction_end_time auctionEndTime,a.open_at openAt,a.owners_end_time ownersEndTime,a.is_show isShow,geo.city_name cityName from 
    (select u.*,r.rId,r.amount,r.city_id,r.real_amount,r.gem,r.auction_end_time,r.open_at,r.owners_end_time,r.is_show from 
    
    (select car.user_id,car.city_id,car.amount,car.real_amount,car.gem,ca.auction_end_time,ca.open_at,ca.owners_end_time,ca.is_show,car.rId from (select id rId,user_id,city_id,amount,real_amount,gem from city_auction_records where id in (select max(id) from city_auction_records group by city_id)) car left join city_auctions ca on car.city_id=ca.city_id) r 
    
    left join 
    
    (select id,mobile,name,avatar_url from user where id in (select user_id from city_auction_records where id in (select max(id) from city_auction_records group by city_id))) u on r.user_id=u.id) a left join geo_dictionarys geo on geo.id=a.city_id limit ${pageIndex},${pageSize};`;
    db.getArray(sql, callback);
}

exports.findCityOwnersCount = (callback) => {
    let sql = `select COUNT(1) as totalPage from 
    (select u.*,r.amount,r.city_id,r.real_amount,r.gem from 
    (select user_id,city_id,amount,real_amount,gem from city_auction_records where id in (select max(id) from city_auction_records group by city_id)) r left join 
    
    (select id,mobile,name,avatar_url from user where id in (select user_id from city_auction_records where id in (select max(id) from city_auction_records group by city_id))) u on r.user_id=u.id) a left join geo_dictionarys geo on geo.id=a.city_id;`
    db.getObject(sql, callback);
}