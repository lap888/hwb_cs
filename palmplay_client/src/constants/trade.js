/*
 * @Author: fantao.meng 
 * @Date: 2019-05-03 00:08:49 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-11 22:54:35
 */

export const APPEAL_STATUS = [
    { key: 0, value: "待处理" },
    { key: 1, value: "驳回" },
    { key: 2, value: "同意" },
    { key: 3, value: "全部" },
];

// 交易时间轴设置
export const TRANSACTION_PROGRESS = [
    { key: "entryOrderTime", value: "挂单时间" },
    { key: "dealTime", value: "接单时间" },
    { key: "paidTime", value: "支付时间" },
    { key: "createTime", value: "申诉时间" },
    { key: "updateTime", value: "申诉处理时间" },
];

// 审核结果
export const APPEAL_RESULT = [
    { key: 0, value: "驳回" },
    { key: 1, value: "同意" },
];