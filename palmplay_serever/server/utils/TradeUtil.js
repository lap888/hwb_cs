exports.getTradeNumber = function(){
	const now = new Date();
	let year = now.getFullYear();
	let month =  now.getMonth();
	let day = now.getDate();
	let hour = now.getHours();
	let minutes = now.getMinutes();
	let seconds =now.getSeconds();
	return year.toString() + month.toString() + day + hour + minutes + seconds + (Math.round(Math.random()*89 + 100)).toString();
}