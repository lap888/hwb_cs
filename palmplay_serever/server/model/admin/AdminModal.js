/*
 * @Author: fantao.meng 
 * @Date: 2019-04-02 16:36:43 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-13 10:38:06
 */

const db = require('../../mysql');
var CryptoJS = require('crypto-js');

/**
 * 获取管理员列表
 */
exports.getAdminList = (params, callback) => {
    let { page, _uid } = params;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_list = `select a.id as userId, a.username, a.nickname, ifnull(b.role_name, "未分配角色") as roleName, a.create_time as createTime from admin_users a left join admin_roles b on b.role_id = a.role ${sql_limit};`;    
    let sql_total = `select count(a.id) as totalNumber from admin_users a;`;
    db.getArray(sql_list, list => {
        db.getObject(sql_total, ({ totalNumber }) => {
            callback({
                success: true,
                data: { list, totalNumber },
                errorMsg: ""
            });
        })
    })
}

/**
 * 管理员角色列表
 */
exports.getRoleList = (params, callback) => {
    let { _uid } = params;
    let sql_list = `select a.role_id as roleId, a.role_name as roleName from admin_roles a where a.is_deleted = 0;`;
    db.getArray(sql_list, list => {
        callback({
            success: true,
            data: { list },
            errorMsg: ""
        });
    })
}

/**
 * 创建管理员
 */
exports.createAdmin = (params, callback) => {
    // let { username, nickname, password, role } = params;
    // // 密码加密
    // let passwordMD5 = "'" + CryptoJS.MD5(password).toString(CryptoJS.enc.Hex) + "'";
    // // 判断账户是否
    // let sql_exist = `select a.id from admin_users a where username = '${username}';`;
    // // 创建账户
    // let sql_create = `insert into admin_users (username, nickname, password, role) values ('${username}', '${nickname}', ${passwordMD5}, ${role});`;
    // db.getObject(sql_exist, existResponse => {
    //     if (!existResponse) {
    //         db.query(sql_create, createResponse => {
    //             callback({
    //                 success: createResponse.affectedRows === 1,
    //                 data: {},
    //                 errorMsg: `${createResponse.affectedRows === 1 ? ('管理员' + username + '创建成功') : ('管理员' + username + '创建失败：' + createResponse.message)}`
    //             });
    //         })
    //     } else {
    //         callback({
    //             success: false,
    //             data: {},
    //             errorMsg: `${username} 用户已存在`
    //         });
    //     }
    // })
    callback({
        success: false,
        data: {},
        errorMsg: `我正在看着你看着你目不转睛`
    });
}

/**
 * 角色列表
 */
exports.getRoleList = (params, callback) => {
    let { page, _uid } = params;
    let sql_limit = `limit ${(page - 1) * 10}, 10`;
    let sql_list = `select a.role_id as roleId, a.role_name as roleName, a.create_time as createTime from admin_roles a ${page !== -1 ? sql_limit : ''};`;
    let sql_total = `select count(a.role_id) as totalNumber from admin_roles a;`;
    db.getArray(sql_list, list => {
        db.getObject(sql_total, ({ totalNumber }) => {
            callback({
                success: true,
                data: { list, totalNumber },
                errorMsg: ""
            });
        })
    })
}

// 角色权限列表
exports.getRightList = (params, callback) => {
    let { _uid } = params;
    let sql_list = `select a.right_id as rightId, a.right_name as rightName, a.code from admin_rights a where a.enable = 1;`;
    db.getArray(sql_list, list => {
        callback({
            success: true,
            data: { list },
            errorMsg: ""
        });
    })
}

// 角色权限列表
exports.getRoleRightList = (params, callback) => {
    let { roleId, _uid } = params;
    let sql_list = `select a.role_id as roleId, a.right_id as rightId from admin_role_rights a where role_id = ${roleId};`;
    db.getArray(sql_list, list => {
        callback({
            success: true,
            data: { list },
            errorMsg: ""
        });
    })
}

// 操作角色权限
exports.operateRoleRight = (params, callback) => {
    let { roleRightAdd, roleRightDelete, roleId, _uid } = params;
    let roleRightAddArray = JSON.parse(roleRightAdd);
    let roleRightDeleteArray = JSON.parse(roleRightDelete);
    let addLength = roleRightAddArray.length;
    let deleteLength = roleRightDeleteArray.length;


    let sql_insert = '';
    if (addLength > 0) {
        let values = roleRightAddArray.map((item, index) => {
            return `(${item['roleId']}, ${item['rightId']})`;
        })
        
        let valuesString = values.join(",");
        sql_insert = `insert into admin_role_rights (role_id, right_id) values ${valuesString};`;
        // console.log(sql_insert);
    }
    let sql_delete = '';
    if (deleteLength > 0) {
        let wheres = roleRightDeleteArray.map(item => {
            return `(role_id = ${item['roleId']} and right_id = ${item['rightId']})`;
        })
        let wheresString = wheres.join(" OR ");
        sql_delete = `delete from admin_role_rights where ${wheresString};`;
        // console.log(sql_delete);
    }

    if (sql_insert && sql_delete) {
        db.query(sql_insert, insertResponse => {
            db.query(sql_delete, deleteResponse => {
                this.getRoleRightList({ roleId, _uid }, callback);
            });
        });
    } else if (sql_insert) {
        db.query(sql_insert, insertResponse => {
            this.getRoleRightList({ roleId, _uid }, callback);
        });
    } else if (sql_delete) {
        db.query(sql_delete, deleteResponse => {
            this.getRoleRightList({ roleId, _uid }, callback);
        });
    } else {
        this.getRoleRightList({ roleId, _uid }, callback);
    }
}
