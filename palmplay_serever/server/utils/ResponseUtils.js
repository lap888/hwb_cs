/*
 * @Author: fantao.meng 
 * @Date: 2019-04-13 10:34:45 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-04-23 23:46:46
 */

// 获取当前月的最后一天
exports.resolveError = (error, callback) => {
    console.log(error);
    callback({
        success: false,
        data: { error },
        errorMsg: error['code']
    });
}