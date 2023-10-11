/*
 * @Author: fantao.meng 
 * @Date: 2019-04-01 18:51:38 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-13 19:14:36
 */

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { persistReducer, persistStore, autoRehydrate } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import { createLogger } from 'redux-logger'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import UserReducer from './UserReducer';
import AuthReducer from './AuthReducer';
import Config from 'config';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const enhancer = Config.Env === "dev" ? composeEnhancers(
    applyMiddleware(
        createLogger(), 
    ),
    // 持久化增强器(用于启动分发Store)
) : composeEnhancers()

export default function configureStore () {
    const RootReducer = combineReducers ({
        user: UserReducer,
        auth: AuthReducer
    });

    const persistConfig = {
        key: 'root',
        storage,
        blacklist: [
        ],
        transform: [
        ],
        stateReconciler: autoMergeLevel2,
        debug: false,
    };

    // 持久化存储Store
    const presistRootReducer = persistReducer(persistConfig, RootReducer);

    const store = createStore(presistRootReducer, enhancer);
    const persistor = persistStore(store);

    // 开启saga对action的监听
    // sagaMiddle.run(rootSage);
    
    return { store, persistor };
}

