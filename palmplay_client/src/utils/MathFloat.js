/*
 * @Author: fantao.meng 
 * @Date: 2019-03-29 14:59:24 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-03-29 15:14:37
 */

export default class MathFloat {
    
    /**
     * 重写toFixed 小数向下截取
     */
    static floor = (number, pow) => {
        if (!number) number = 0;
        return Math.floor(number * Math.pow(10, pow)) / Math.pow(10, pow);
    }
}