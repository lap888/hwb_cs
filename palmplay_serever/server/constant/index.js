/*
 * @Author: fantao.meng 
 * @Date: 2019-04-24 20:32:05 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-04-26 10:56:02
 */

// 矿机
exports.minnings = [
    { "minning_id": 0, "minning_name": "试炼矿机", "gem_in": 10, "gem_out": 11, "minning_time": "3小时", "activity_level": 1, "max_num": 1, "minning_time_second": 10800, "rep": 0 },
    { "minning_id": 1, "minning_name": "初级矿机", "gem_in": 10, "gem_out": 11, "minning_time": "3小时", "activity_level": 1, "max_num": 8, "minning_time_second": 10800, "rep": 1 },
    { "minning_id": 2, "minning_name": "中级矿机", "gem_in": 100, "gem_out": 120, "minning_time": "3小时18分钟", "activity_level": 10, "max_num": 4, "minning_time_second": 11880, "rep": 10 },
    { "minning_id": 3, "minning_name": "高级矿机", "gem_in": 1000, "gem_out": 1280, "minning_time": "3小时30分钟", "activity_level": 100, "max_num": 2, "minning_time_second": 12600, "rep": 100 },
    { "minning_id": 4, "minning_name": "超级矿机", "gem_in": 10000, "gem_out": 13500, "minning_time": "3小时42分钟", "activity_level": 1000, "max_num": 1, "minning_time_second": 13320, "rep": 1000 },
    { "minning_id": 5, "minning_name": "专家矿机", "gem_in": 100000, "gem_out": 140000, "minning_time": "3小时48分钟", "activity_level": 10000, "max_num": 1, "minning_time_second": 13680, "rep": 10000 },
    { "minning_id":6,"minning_name":"进阶矿机","gem_in":400,"gem_out":500,"minning_time": "4h","activity_level": 40, "color": '#F79B61' },
    { "minning_id":7,"minning_name":"精英矿机","gem_in":5000,"gem_out":6500,"minning_time": "4h","activity_level": 400, "color": '#E5CF61' },
];

// 星级达人升级指南
exports.STAR_LEVEL_DETAILS = [
    { key: 0, name: "暂无等级", reward: "", request: `` },
    { key: 1, name: "一星达人", reward: "奖励1个初级矿机", request: `直推20人&
团队活跃度500点` },
    { key: 2, name: "二星达人", reward: "奖励1个中级矿机&全球交易手续费分红20%", request: `团队活跃度2000点&
小区活跃度400点` },
    { key: 3, name: "三星达人", reward: "奖励1个高级矿机&全球交易手续费分红15%", request: `团队活跃度8000点&
小区活跃度2000点` },
    { key: 4, name: "四星达人", reward: "奖励1个超级矿机&全球交易手续费分红10%", request: `团队活跃度100000点&
小区活跃度25000点` },
    { key: 5, name: "五星达人", reward: "奖励1个专家矿机&全球交易手续费分红5%", request: `团队活跃度500000点&
小区活跃度100000点` },
];