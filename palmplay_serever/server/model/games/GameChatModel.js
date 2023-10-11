/* 游戏群聊后台接口
 * @Author: top 
 * @Date: 2019-03-30 10:25:25 
 * @Last Modified by: top
 * @Last Modified time: 2019-03-30 10:56:00
 */
const db = require('../../mysql');
//更新游戏群聊展示状态
exports.gameShowGroupStatus = (game_id, callback) => {
    let sql = `UPDATE game_infos
    SET is_show_group = 0,
     updated_at = NOW()
    WHERE
        id = '${game_id}';`;
    db.query(sql, callback);
}
//获取游戏 id,name
exports.findGameIdAndNames = (callback) => {
    let sql = `SELECT
    id,g_title
    FROM
    game_infos;`
    db.getArray(sql, callback);

}
//获取游戏群用户
exports.findGameChatUsers = (gameId, callback) => {
    let sql = `SELECT
    gcu.name as nick, gcu.role, gcu.status, gc.*
        FROM
    group_chat_users AS gcu
    LEFT JOIN group_chat AS gc ON gcu.group_chat_id = gc.id
    WHERE
    gc.game_id = '${gameId}';`;
    db.getArray(sql, callback);
}
//添加游戏群
exports.insertInfoGameChat=()=>{}
//添加游戏群用户


/*
获取游戏名 , logo
*/


/*
更具游戏 id 获取相关群 用户
*/


/*
为游戏群添加用户 (群主/管理/普通人)
add / update
*/

//SELECT * FROM group_chat_users;