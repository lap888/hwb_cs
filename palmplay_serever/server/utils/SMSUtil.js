const request = require('request');

// 订单触发     给用户发短信
// 需要参数     mobile     temp_id(模板id)    gem_num   
exports.sendSMS = function(data){
	const method = "POST";
	const url =  "https://api.sms.jpush.cn/v1/messages";
	let requestData = {mobile: data.mobile, temp_id: data.temp_id, temp_para: {"gem_num": data.gem_num}};
	console.log(requestData)

	request({
	    url: url,
	    method: method,
	    headers: {
	        "content-type": "application/json",
	        "Authorization": "Basic YzYyMDc1YjMwMmQyNTNmN2IwMTU0Y2ViOjE5MjdlMTY3ZGM5MDBmY2UzYmQ2MWQyOQ=="
	    },
	    body: JSON.stringify(requestData)
	},function(error, response, body){
		let result = JSON.parse(body);
		console.log(result)
		// if(!result.msg_id){
		// 	callback({success: false})
		// }else{
		// 	callback({success: true, data: result})
		// }
	})

}
