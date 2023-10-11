/*
 * @Author: fantao.meng 
 * @Date: 2019-04-01 17:14:41 
 * @Last Modified by: top.brids
 * @Last Modified time: 2019-10-17 21:02:55
 */

const db = require('../../mysql');
var CryptoJS = require('crypto-js');
var request = require('request');

// 管理员登录
exports.login = (params, callback) => {
    let { username, password, _uid } = params;
    let passwordMD5 = CryptoJS.MD5(password).toString(CryptoJS.enc.Hex);
    console.log('passwordMd5',passwordMD5)
    // 登录检查
    let sql_auth = `select a.id as userId, a.username, a.nickname, a.role, ifnull(b.role_name, '') as roleName from admin_users a left join admin_roles b on b.role_id = a.role where a.username = '${username}' and a.password = '${passwordMD5}';`;
    db.getObject(sql_auth, responseUserInfo => {
        let success = Boolean(responseUserInfo);
        if (success) {
            // 权限获取
            let sql_role_right = `select b.right_name as rightName, b.code from admin_role_rights a right join admin_rights b on b.right_id = a.right_id and b.enable = 1 where a.role_id = ${responseUserInfo['role']};`;
            db.getArray(sql_role_right, responseRoleRight => {
                if (!responseRoleRight) responseRoleRight = [];
                // 验证码校验
                // exports.confrimVcode(params, confirmResponse => {
                //     if (!confirmResponse['success']) {
                //         callback(confirmResponse);
                //     } else {
                //         callback({
                //             success,
                //             data: { userInfo: Object.assign(responseUserInfo, { rights: responseRoleRight }) },
                //             errorMsg: ""
                //         });
                //     }
                // })
                callback({
                    success,
                    data: { userInfo: Object.assign(responseUserInfo, { rights: responseRoleRight }) },
                    errorMsg: ""
                });
            })
        } else {
            callback({
                success,
                data: {},
                errorMsg: "用户名或密码错误"
            });
        }
    })
}

// 发送手机验证码
exports.sendVcode = (params, callback) => {
    let { mobile, _uid } = params;
    // 检验手机号是否存在
    isExistMobile(params, existResponse => {
        if (existResponse.success) {
            // 发送验证码
            const method = "POST";
            const url = "https://api.sms.jpush.cn/v1/codes";
            let requestData = { mobile, temp_id: "160530" };

            request({
                url: url,
                method: method,
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Basic YzYyMDc1YjMwMmQyNTNmN2IwMTU0Y2ViOjE5MjdlMTY3ZGM5MDBmY2UzYmQ2MWQyOQ=="
                },
                body: JSON.stringify(requestData)
            }, function (error, response, body) {
                let result = JSON.parse(body);
                if (!result.msg_id) {
                    callback({ success: false, errorMsg: "验证码发送失败" });
                } else {
                    callback({ success: true, data: result });
                }
            })
        } else {
            callback({ success: false, errorMsg: existResponse.errorMsg })
        }
    })
}

// 验证手机验证码    
exports.confrimVcode = function (params, callback) {
    let { username, vsCode, imgId, _uid } = params;
    console.log(params);
    const method = "POST";
    const url = `https://api.sms.jpush.cn/v1/codes/${imgId}/valid`;
    let requestData = { code: vsCode };
    request({
        url: url,
        method: method,
        headers: {
            "content-type": "application/json",
            "Authorization": "Basic YzYyMDc1YjMwMmQyNTNmN2IwMTU0Y2ViOjE5MjdlMTY3ZGM5MDBmY2UzYmQ2MWQyOQ=="
        },
        body: JSON.stringify(requestData)
    }, function (error, response, body) {
        result = JSON.parse(body);
        console.log(result);
        if (!result.is_valid) {
            callback({ success: false, errorMsg: "验证码不正确" })
        } else {
            callback({ success: true })
        }
    })
}

// 检测手机号
let isExistMobile = (params, callback) => {
    let { mobile, _uid } = params;
    let sql_exist = `select ifnull(count(a.id), 0) as existNumber from admin_users a where a.username = ${mobile};`;
    db.getObject(sql_exist, ({ existNumber }) => {
        if (existNumber === 1) {
            callback({ success: true });
        } else {
            callback({ success: false, errorMsg: "非管理员账户" });
        }
    })
}


