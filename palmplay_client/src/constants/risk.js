/*
 * @Author: fantao.meng 
 * @Date: 2019-04-26 10:48:51 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-08 23:57:08
 */

// 星级达人升级指南
export const STAR_LEVEL_DETAILS = [
    { key: 0, name: "暂无等级", reward: `--`, request: `--`, color: '#73849d' },
    { key: 1, name: "一星达人", reward: "奖励1个初级矿机", request: `直推20人&
团队活跃度500点`, color: '#53b488' },
    { key: 2, name: "二星达人", reward: "奖励1个中级矿机&全球交易手续费分红20%", request: `团队活跃度2000点&
小区活跃度400点`, color: '#a48f7e' },
    { key: 3, name: "三星达人", reward: "奖励1个高级矿机&全球交易手续费分红15%", request: `团队活跃度8000点&
小区活跃度2000点`, color: '#ca6869' },
    { key: 4, name: "四星达人", reward: "奖励1个超级矿机&全球交易手续费分红10%", request: `团队活跃度100000点&
小区活跃度25000点`, color: '#994dd7' },
    { key: 5, name: "五星达人", reward: "奖励1个专家矿机&全球交易手续费分红5%", request: `团队活跃度500000点&
小区活跃度100000点`, color: '#73849d' },
];

// 矿机类型
export const MINING_TYPE_LIST = [
    { "minning_id": 0, "minning_name": "试炼矿机", "gem_in": 10, "gem_out": 11, "minning_time": "4h", "activity_level": 1, "color": '#73849d' },
    { "minning_id": 1, "minning_name": "初级矿机", "gem_in": 10, "gem_out": 11, "minning_time": "4h", "activity_level": 1, "color": '#53b488' },
    { "minning_id": 2, "minning_name": "中级矿机", "gem_in": 100, "gem_out": 120, "minning_time": "4h", "activity_level": 10, "color": '#a48f7e' },
    { "minning_id": 3, "minning_name": "高级矿机", "gem_in": 1000, "gem_out": 1280, "minning_time": "4h", "activity_level": 100, "color": '#ca6869' },
    { "minning_id": 4, "minning_name": "超级矿机", "gem_in": 10000, "gem_out": 13500, "minning_time": "4h", "activity_level": 1000, "color": '#994dd7' },
    { "minning_id": 5, "minning_name": "专家矿机", "gem_in": 100000, "gem_out": 140000, "minning_time": "4h", "activity_level": 100000, "color": '#73849d' },
    { "minning_id": 6, "minning_name": "进阶矿机", "gem_in":400, "gem_out": 500, "minning_time": "4h","activity_level": 40, "color": '#F79B61' },
    { "minning_id": 7, "minning_name": "精英矿机", "gem_in":5000, "gem_out": 6500, "minning_time": "4h","activity_level": 400, "color": '#E5CF61' },
];

// 矿机来源
export const MINING_SOURCE_LIST = [
    { key: 0, value: '注册赠送' },
    { key: 1, value: '兑换' },
    { key: 2, value: '达人赠送' },
    { key: 3, value: '游戏奖励' },
];

// 用户操作日志
export const LOG_ROUTE = {
    // 管理员
    "Admin.getAdminList": "用户管理员列表",
    "Admin.getRoleList": "管理员角色列表",
    "Admin.createAdmin": "创建管理员",
    "Admin.getRoleList": "角色列表",
    "Admin.getRightList": "权限列表",
    "Admin.getRoleRightList": "角色权限列表",
    "Admin.operateRoleRight": "编辑角色权限",
    // APP配置
    "App.systemBanner": "客户端轮播图",
    "App.likeGameList": "自动补全游戏列表",
    "App.submmitBanner": "上传轮播位信息",
    "App.onlineBanner": "上、下线轮播位信息",
    "App.updateBanner": "编辑轮播位信息",
    // 权限
    "Auth.login": "管理员登录",
    // 游戏
    "Game.getGameCategories": "获取游戏类别信息",
    "Game.getGameCategorie": "获取单一游戏类别信息",
    "Game.updateGameCategorie": "修改游戏类别",
    "Game.addGameCategorie": "新增游戏类别",
    "Game.delGameCategorie": "删除游戏类别",
    "Game.supplierList": "游戏供应商列表",
    // 钻石
    "Gem.gemAllAmounts": "钻石总量",
    "Gem.gemTodayAmounts": "当日新增钻石",
    "Gem.MinningSubGem": "兑换矿机消耗钻石",
    "Gem.CoinSubGem": "交易手续费消耗",
    "Gem.GameSubGem": "游戏分红消耗",
    // 钻石流水
    "GoldFlow.addGoldFlow": "创建金币流水记录",
    "GoldFlow.addGoldFlow_2": "创建金币流水记录",
    // 订单
    "Order.orderAmounts": "订单总量",
    "Order.nearDayOrderAmounts": "近七日订单成交量",
    "Order.nearDayGemAmounts": "近七日钻石成交数",
    "Order.nearDayGemAvgAmounts": "近七日钻石平均价格",
    "Order.feeAccount": "交易手续费统计",
    // 风控
    "Risk.miningList": "矿机信息统计",
    "Risk.miningUserList": "矿机持有人列表",
    "Risk.starList": "星级达人信息统计",
    "Risk.starUserList": "星级达人列表",
    "Risk.cityList": "城市信息统计",
    "Risk.logList": "操作日志列表",
    "Risk.createLog": "创建操作日志",
    // 交易
    "Trade.tradeList": "交易列表",
    "Trade.appealList": "申诉列表",
    "Trade.appealInfo": "申诉详细信息",
    // 用户-实名认证
    "User.authenticationinfos": "获取实名人工审核列表",
    "User.notAgreeAuthenticationInfo": "驳回人工审核",
    "User.agreeAuthenticationInfo_2": "同意人工审核",
    "User.getAuthenticationInfosDetail": "获取人工审核详情",
    // 用户-用户信息统计
    "User.userCount": "平台用户量统计",
    "User.sevenDayUserCounts": "近七日实名用户总量",
    // 用户-用户详情
    "User.getUserList": "获取用户列表",
    "User.getUserStatictics": "用户基本信息",
    "User.getMiningList": "用户矿机列表",
    "User.getMiningStatictics": "用户矿机统计",
    "User.getDiamondList": "用户钻石记录列表",
    "User.getDiamondStatictics": "用户钻石统计信息",
    "User.getDividendStatictics": "用户钱包统计信息",
    "User.getDividendList": "用户账单列表信息",
    "User.getWithDrawList": "用户钱包提现列表信息",
    "User.getTransactionStatictics": "用户交易统计信息",
    "User.getTransactionList": "用户交易列表信息",
    "User.getContributeStatictics": "用户贡献值统计信息",
    "User.getContributeList": "用户贡献值列表信息",
    "User.getHonorStatictics": "用户荣誉值统计信息",
    "User.getHonorList": "用户荣誉值列表信息",
    "User.getRelationStatictics": "用户团队统计信息",
    "User.getRelationList": "用户团队列表信息",
    "User.getBaseActivityLevel": "用户基础活跃度统计",
    "User.getAddActivityLevel": "用户加成活跃度统计",
    "User.getBaseActivityList": "用户基础活跃度列表",
    "User.getAddActivityList": "用户加成活跃度列表",
    // 提现
    "WithDraw.userWithDrawInfo": "提现列表",
    "WithDraw.notAgreeWithDrawInfo": "驳回提现",
    "WithDraw.updateWithDrawHistory": "添加打款订单号",
    "WithDraw.agreeWithDraw": "同意提现",
};


// 日志模块
export const LOG_MODULE = [
    { key: "", value: "全部" },
    
    { key: "Admin", value: "管理员" },
    { key: "App", value: "APP配置" },
    { key: "Auth", value: "权限" },
    { key: "Game", value: "游戏" },
    { key: "Gem", value: "钻石" },
    { key: "GoldFlow", value: "钻石流水" },
    { key: "Order", value: "订单" },
    { key: "Risk", value: "风控" },
    { key: "User", value: "用户" },
];