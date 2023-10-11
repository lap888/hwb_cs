/*
 * @Author: fantao.meng 
 * @Date: 2019-04-02 11:15:22 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-13 17:04:06
 */

import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import configureStore from '../reducers/CreateStore';
import Routes from './Routes';
let { store, persistor } = configureStore();

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Provider store={store}>
                <PersistGate persistor={persistor}>
                    <Routes />
                </PersistGate>
            </Provider>
        )
    }
}
