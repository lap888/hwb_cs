/*
 * @Author: fantao.meng 
 * @Date: 2019-04-08 23:42:19 
 * @Last Modified by: top.brids
 * @Last Modified time: 2019-10-17 20:54:36
 */

import Config from 'config';

const queues = {};
const sending = {};

export function Send(method, data, callback) {
	let random = Math.random() * 100;
	let queue = queues[method];
	if (!queue) {
		queue = [];
		queues[method] = queue;
	}
	queues[method].push({data:data, callback:callback});
	if (!sending[method]) {
		sendInternal(method, data, callback);
	}
}

// 请求队列分发
function sendInternal(method, data, callback) {
	sending[method] = true;
	if (!data._uid) data._uid = -1;
	data._method = method;
	data._time = new Date().getTime();
	data._key = CryptoJS.MD5(data._uid + Config.AUTH_SECRET + Math.floor(data._time/86400000)).toString(CryptoJS.enc.Hex);
	data._sign = getSign(data);
	console.log('JSON.stringify(data)',JSON.stringify(data))
	Config.Env === 'dev' && console.log(`${data['_method']}`);
	Config.Env === 'dev' && console.log(data);
	fetch(Config.API_ADMIN_PATH,{
		method: 'POST',
		body: JSON.stringify(data),
	})
	.then(response => {
		// console.log(response);
	    return response.json();
	})
	.then(responseJson => {
		Config.Env === 'dev' && console.log(`${data['_method']}`);
		Config.Env === 'dev' && console.log(responseJson);
		if (responseJson.hasOwnProperty('code')) {
			return {
				success: false,
				errMsg: "系统异常，请重新登录",
				code: responseJson['code'],
				_method: responseJson['method']
			}
		}
		return responseJson;
	})
	.then(result => {
		// 创建操作日志
		createLog(method, data);
		let queue = queues[result._method];
		if (queue && queue.length>0) {
			queue.shift();
		}
		if (queue.length>0) {
			var obj = queue[0];
			sendInternal(result._method, obj.data, obj.callback);
		} else {
			sending[result._method] = false;
		}
		callback(result);
	})
	.catch(e => {
		console.log(e);
		let queue = queues[data._method];
		if (queue && queue.length>0) {
			queue.shift();
		}
		if (queue.length>0) {
			var obj = queue[0];
			sendInternal(data._method, obj.data, obj.callback);
		} else {
			sending[data._method] = false;
		}
	});
}

// 创建操作日志
function createLog(method, data) {
	if (["Risk.createLog","Risk.logList", "Auth.login"].indexOf(method) !== -1) return;
	Send('Risk.createLog', { _uid: data._uid, params: JSON.stringify(data) }, response => {})
}

// 上传图片
export function uploadImage(params, callback) {
	let token = "";
    return new Promise(function (resolve, reject) {
        let formData = new FormData();
        for (var key in params){
            formData.append(key, params[key]);
        }
        let pathAry= params.path.split("/");
        let file = { uri: params.path, type: 'application/octet-stream', name: pathAry[pathAry.length-1] };
		formData.append("file", file);
        fetch(Config.RUBY_API_PATH + `image/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data;charset=utf-8',
                "x-access-token": token,
            },
            body: formData,
		})
		.then(response => {
			Config.Env === 'dev' && console.log(response);
			return response.json();
		})
        .then(callback)
        .catch((error)=> {
            console.log(error);
        });
    });
}

// 加密参数
function getSign (obj) {
	let kv = [];
	for (let k in obj) {
		if (k=='_sign') continue;
		let v = obj[k];
		let t = typeof(v);
		if (t=='number' || t=='string') {
			kv.push(`${k}=${v}`);
		}
	}
	kv.sort();
	kv.push(Config.AUTH_SECRET);
	return CryptoJS.MD5(kv.join('&')).toString(CryptoJS.enc.Hex);
};
