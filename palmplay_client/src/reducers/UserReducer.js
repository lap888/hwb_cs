/*
 * @Author: fantao.meng 
 * @Date: 2019-03-25 16:03:52 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-13 11:52:45
 */

import ActionTypes from 'ActionTypes';

const initialState = {
    isLogged: false,

    userId: -1,
    username: '',
    nickname: '',
    role: '',
    roleName: '',
    rights: [],
    expiredTime: new Date().getTime(),
}

const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.LOGIN_SUCCESS:
            let { userInfo } = action.payload;
            return {
                ...state,
                ...userInfo,
                expiredTime: new Date().getTime() + 86400000,
                isLogged: true
            }
        case ActionTypes.LOGOUT:
            return {
                ...initialState
            }
        default:
            return state;
    }
}

export default UserReducer;