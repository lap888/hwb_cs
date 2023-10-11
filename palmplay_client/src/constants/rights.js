/*
 * @Author: fantao.meng 
 * @Date: 2019-04-02 14:29:12 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-04-08 19:05:42
 */

/**
 * 路由访问权限 {path: rightCode}
 */
module.exports = {
    // 用户
    '/client': {rightName: "用户列表", code: "CLIENT_LIST"},
    '/clientinfo/:userId': {rightName: "用户详情", code: "CLIENT_INFO"},
    // 游戏
    "/game": {rightName: "游戏列表", code: "GAME_LIST"},
    '/gametype': {rightName: "游戏分类", code: "GAME_TYPE_LIST"},
    '/gamesupplier': {rightName: "游戏供应商", code: "GAME_SUPPLIER_LIST"},
    // 审核
    '/authentication': {rightName: "实名认证人工审核", code: "CERTIFICATION_REVIEW_LIST"},
    '/withdraw': {rightName: "提现列表", code: "WITHDRAW_LIST"},
    // 交易
    '/transaction': {rightName: "交易列表", code: "TRANSACTION_LIST"},
    '/appeallist': {rightName: "交易审核列表", code: "TRANSACTION_APPEAL_LIST"},
    // 管理
    '/admin': {rightName: "管理员列表", code: "ADMIN_LIST"},
    '/role': {rightName: "角色列表", code: "ROLE_LIST"},
    '/adminrightoperation/:roleId/:roleName': {rightName: "分配权限", code: "ROLE_RIGHT"},
}