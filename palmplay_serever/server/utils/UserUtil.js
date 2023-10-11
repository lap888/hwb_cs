// 检验参数中是否包含 uId      注意参数名称
exports.isValidUid = function(uId){
	return (uId == '' || uId == null || uId == undefined) ? false : true
}
