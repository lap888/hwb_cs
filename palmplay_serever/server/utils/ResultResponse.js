/**
 * 统一响应
 * by 鸟窝 封装
 */
// 成功
/**
 * 
 * @param {要返回的数据体} data 
 * @param {页索引} pageIndex 
 * @param {页大小} pageSize 
 * @param {总条数} total 
 */
exports.OK = (data, pageIndex = 0, pageSize = 0, total = 0) => {
    let _data = {
        success: true,
        errorMsg: 'success',
        data: data,
        pageIndex: pageIndex,
        pageSize: pageSize,
        total: total
    };
    return _data;
}

/**
 * 错误消息体
 */
exports.Err = (msg) => {
    let _data = {
        success: false,
        errorMsg: msg,
    }
    return _data;
}

/**
 * 封装分页数据统一校验 by 鸟窝
 * 针对需要传递分页信息的数据
 * 进行 pageIndex 和 pageSize 的处理
 * 
 */
exports.PageV=(data)=>{
    let _data=data;
    let pageIndex = data.pageIndex ? data.pageIndex : 0;
	let pageSize = data.pageSize ? data.pageSize : 10;
    let skip=pageIndex==0?0:(pageIndex-1)*pageSize;
    _data.pageIndex=skip;
    _data.pageSize=pageSize;
    return _data;
    
}
