/*
 * @Author: fantao.meng 
 * @Date: 2019-02-19 20:23:02 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-11 11:28:30
 */

// Menu 参数
export const MENU_ARRAY = [
    {   
        key: "1", 
        title: "首页", 
        icon: "home",
        path: "/"
    },
    {
        key: "2", 
        title: "用户管理", 
        icon: "user", 
        submenu: [
            { key: "2-1", title: "用户列表", icon: "usergroup-add", path: "/client" },
            { key: "2-2", title: "交易解禁", icon: "audit", path: "/" },
        ]
    },
    {
        key: "3", 
        title: "交易管理", 
        icon: "red-envelope", 
        submenu: [
            { key: "3-1", title: "订单列表", icon: "money-collect", path: "/transaction" },
            { key: "3-2", title: "申诉列表", icon: "property-safety", path: "/appeallist" },
        ]
    },
    {
        key: "4",
        title: "游戏管理", 
        icon: "crown", 
        submenu: [
            { key: "4-1", title: "游戏列表", icon: "table", path: "/game" },
            { key: "4-2", title: "游戏分类", icon: "cluster", path: "/gametype" },
            { key: "4-3", title: "游戏供应商", icon: "deployment-unit", path: "/gamesupplier" },
        ]
    },
    {
        key: "5",
        title: "审核管理", 
        icon: "scan", 
        submenu: [
            { key: "5-1", title: "人工认证", icon: "hourglass", path: "/authentication" },
            { key: "5-2", title: "提现审核",  icon: "pay-circle", path: "/withdraw" },
        ]
    },
    {
        key: "6",
        title: "APP配置", 
        icon: "scan", 
        submenu: [
            { key: "6-1", title: "城市大厅", icon: "hourglass", path: "/auctioncity" },
            { key: "6-2", title: "轮播图", icon: "hourglass", path: "/systembanner" },
        ]
    },
    {
        key: "7",
        title: "风控管理", 
        icon: "warning",
        submenu: [
            { key: "7-1", title: "矿机", icon: "trademark", path: "/riskmining" },
            { key: "7-2", title: "星级达人",  icon: "global", path: "/riskstar" },
            { key: "7-3", title: "城市",  icon: "red-envelope", path: "/risklocation" },
            // { key: "7-4", title: "交易",  icon: "red-envelope", path: "/risktransaction" },
        ]
    },
    {
        key: "8",
        title: "管理员", 
        icon: "solution", 
        submenu: [
            { key: "8-1", title: "管理员列表", icon: "team", path: "/admin" },
            { key: "8-2", title: "角色",  icon: "bulb", path: "/role" },
            { key: "8-3", title: "操作日志",  icon: "red-envelope", path: "/risklog" },
        ]
    },
    {
        key: "9", 
        title: "关于我们", 
        icon: "pie-chart",
        path: "/"
    },
]