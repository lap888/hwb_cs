
/**判断输入数据是否是正整数**/
exports.isPositiveInteger = function(inputs){
	if (!(/(^[1-9]\d*$)/.test(inputs))) { 
　　　　　　return false; 
　　　　}else { 
　　　　　　return true;
　　　　} 
}
/**判断输入数据是否是正数**/
exports.isPositive = function(inputs){
	if (!(/^\d+(?=\.{0,1}\d+$|$)/.test(inputs))) { 
　　　　　　return false; 
　　　　}else { 
　　　　　　return true;
　　　　} 
}
