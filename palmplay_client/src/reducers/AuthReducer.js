/*
 * @Author: fantao.meng 
 * @Date: 2019-05-13 11:53:06 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-13 14:26:55
 */

import ActionTypes from 'ActionTypes';

const initialState = {
    count: 0,
    imgId: ""
}

const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.UPSET_VSCODE_COUNT:
            let { count } = action.payload;
            return {
                ...state,
                count
            }
        case ActionTypes.UPSET_VSCODE_IMGID:
            let { imgId } = action.payload;
            return {
                ...state,
                imgId
            }
        default:
            return state;
    }
}

export default AuthReducer;