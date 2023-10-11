/*
 * @Author: fantao.meng 
 * @Date: 2019-02-21 18:43:21 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-02 22:51:15
 */

/**
 * 用户状态
 */
export const CLIENT_STATUS = [
    { key: "", value: "全部用户" },
    { key: "0", value: "正常用户" },
    { key: "1", value: "封禁用户" },
];

/**
 * 审核信息 状态 
 * 0:审核中, 1:初步审核通过, 2:审核通过, 3:审核未通过
 */
export const Authentication_Status = [
    { key: "-1", value: "全部" },
    { key: "0", value: "审核中" },
    { key: "1", value: "初步审核通过" },
    { key: "2", value: "审核通过" },
    { key: "3", value: "审核未通过" },
];

/**
 * 矿机类型列表
 */
export const MINING_TYPE_LIST = [
    { "minning_id": 0, "minning_name": "试炼矿机", "gem_in": 10, "gem_out": 11, "minning_time": "4h", "activity_level": 1, "color": '#73849d' },
    { "minning_id": 1, "minning_name": "初级矿机", "gem_in": 10, "gem_out": 11, "minning_time": "4h", "activity_level": 1, "color": '#53b488' },
    { "minning_id": 2, "minning_name": "中级矿机", "gem_in": 100, "gem_out": 120, "minning_time": "4h", "activity_level": 10, "color": '#a48f7e' },
    { "minning_id": 3, "minning_name": "高级矿机", "gem_in": 1000, "gem_out": 1280, "minning_time": "4h", "activity_level": 100, "color": '#ca6869' },
    { "minning_id": 4, "minning_name": "超级矿机", "gem_in": 10000, "gem_out": 13500, "minning_time": "4h", "activity_level": 1000, "color": '#994dd7' },
    { "minning_id": 5, "minning_name": "专家矿机", "gem_in": 100000, "gem_out": 14000, "minning_time": "4h", "activity_level": 100000, "color": '#73849d' },
    { "minning_id": 6, "minning_name": "进阶矿机", "gem_in":400, "gem_out": 500, "minning_time": "4h","activity_level": 40, "color": '#F79B61' },
    { "minning_id": 7, "minning_name": "精英矿机", "gem_in":5000, "gem_out": 6500, "minning_time": "4h","activity_level": 400, "color": '#E5CF61' },
];

export const MINING_SOURCE_LIST = [
    { key: 0, value: '' },
    { key: 1, value: '' },
    { key: 2, value: '【达人赠送】' },
    { key: 3, value: '【游戏奖励】' },
];

/**
 * 提现审核状态 提现状态 0：提现中 1：提现成功 1：提现成功
 */

export const WithDrawStatus = [{
    key: "", value: "全部"
}, {
    key: "0", value: "提现中"
}, {
    key: "1", value: "提现成功"
}, {
    key: "2", value: "提现失败"
}];

/**
 * 用户信息操作
 */
export const CLIENT_ACTION = [
    { key: "0", value: "封禁" },
    { key: "1", value: "解封" },
    { key: "2", value: "设备绑定" },
    { key: "3", value: "设备换绑" },
    { key: "4", value: "支付宝修改" },
    { key: "5", value: "更换关系" },
];

/**
 * 钻石流水Source
 */
export const GEM_SOURCE = [
    '挖矿', '购买', '系统赠送', '出售', '兑换', '系统收取', '系统分红', '游戏充值抵扣'
];

/**
 * 分红提现类型
 */
export const WITHDRAW_TYPE = [
    '支付宝', ''
];

/**
 * 分红提现状态
 */
export const WITHDRAW_STATUS = [
    '审核中', '审核通过', '审核失败'
];

/**
 * 交易状态
 */
export const TRANSACTION_STATUS = [
    { key: '0', value: '已取消' },
    { key: '1', value: '已发布买单' },
    { key: '2', value: '待付款' },
    { key: '3', value: '已付款' },
    { key: '4', value: '已完成' },
    { key: '5', value: '申诉中' },
    { key: '6', value: '全部' },
];

/**
 * 实名审核状态 0:审核中, 1:初步审核通过, 2:审核通过, 3:审核未通过
 */
export const AUDIT_STATE = [
    { key: '0', value: '审核中' },
    { key: '1', value: '初步审核通过【已废弃】' },
    { key: '2', value: '审核通过' },
    { key: '3', value: '审核未通过' },
]

// if (this.state.trdeData.status === 2) { return "待付款" }
// if (this.state.trdeData.status === 3) { return "已付款" } 
// if (this.state.trdeData.status === 5) { return "申诉中" }  