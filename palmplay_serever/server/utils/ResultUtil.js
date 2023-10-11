const moment = require('moment');

// 输出返回值
exports.print_result = function(data){
	data.timestamp = new Date().getTime()
	data.datatime = moment().format('YYYY-MM-DD HH:mm:ss')
	console.log(data)
	return data
}