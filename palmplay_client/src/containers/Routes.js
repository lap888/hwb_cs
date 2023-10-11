/*
 * @Author: fantao.meng 
 * @Date: 2019-04-02 11:14:05 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-14 14:34:46
 */

import { Router, Route, IndexRoute, Redirect, Link } from 'react-router';
import { message } from 'antd';
// 布局
import MainLayout from './MainLayout';
// 权限
import Login from './auth/Login';
// 首页
import Home from './Home';
// 用户
import ClientList from './client/ClientList';
import ClientInfo from './client/ClientInfo';
// 游戏
    //游戏列表
import GameList from './game/GameList';
import AddGame from './game/AddGame';
import GameType from './game/GameType';
import GameSupplier from './game/GameSupplier';
// 交易
import Transaction from './transaction/Transaction';
import AppealList from './transaction/AppealList';
import AppealInfo from './transaction/AppealInfo';
// 认证
import AuthenticationList from './authentication/AuthenticationList';
import AuthenticationDetails from './authentication/AuthenticationDetails';
//提现
import WithDraw from './withdraw/WithDraw';
// 管理员
import AdminList from './admin/AdminList';
import AdminRight from './admin/AdminRight';
import AdminCreate from './admin/AdminCreate';
import RoleList from './admin/RoleList';
import AdminRightOperation from './admin/AdminRightOperation';
// App配置
import SystemBanner from './system/SystemBanner';
import AuctionCity from './system/AuctionCity';
import AuctionCityInfo from './system/AuctionCityInfo';
import AuctionCityCreate from './system/AuctionCityCreate';
// 风险管理
import RiskMining from './risk/RiskMining';
import RiskMiningUserList from './risk/RiskMiningUserList';
import RiskStar from './risk/RiskStar';
import RiskStarUserList from './risk/RiskStarUserList';
import RiskTransaction from './risk/RiskTransaction';
import RiskLocation from './risk/RiskLocation';
import RiskLog from './risk/RiskLog';

// history
import { createHashHistory } from 'history';
const history = createHashHistory();
import { connect } from 'react-redux';
// 访问权限
import Rights from '../constants/rights';
import { Send } from 'HttpPost';

class Routes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.locationUrl = '/'
    }

    componentDidMount () {
        Send("Auth.checkAuth", { _uid: this.props.userId }, response => {
            if (!response['success']) {
                // 权限码校验失败
                history.replace('/login');
            }
        })
    }

    componentWillReceiveProps (nextProps) {
        if (!nextProps.isLogged && this.props.isLogged) {
            history.replace('/login');
        }
    }

    /**
     * 路由钩子实现
     */
    onEnter (nextState, replace) {
        if (!this.props.isLogged) replace('/login');
        if (this.props.expiredTime < new Date().getTime()) replace('/login');
        let nextRoutes = nextState['routes'];
        let nextLocation = nextRoutes[nextRoutes.length - 1]['path'];
        // 没有访问权限拦截
        if (!Rights.hasOwnProperty(nextLocation)) return;
        // 获取访问权限信息
        let nextLocationRight = Rights[nextLocation];
        // 检查访问权限
        let checkRight = this.props.rights.some(item => item['code'] === nextLocationRight['code'])
        if (!checkRight) {
            message.warn(`您没有访问【${nextLocationRight['rightName']}】的权限`);
            let locationUrlArray = this.locationUrl.split('#');
            replace(locationUrlArray[locationUrlArray.length - 1]);
            return;
        }
        this.locationUrl = window.location.href;
    }

    render() {
        return (
            <Router history={history}>
                <Route path="/" component={MainLayout} onEnter={this.onEnter.bind(this)} >
                    <IndexRoute component={Home} />
                    {/* 用户 */}
                    <Route path="/client" component={ClientList} onEnter={this.onEnter.bind(this)} />
                    <Route path="/clientinfo/:clientId" component={ClientInfo} onEnter={this.onEnter.bind(this)} />
                    {/* 游戏 */}
                    <Route path="/game" component={GameList} onEnter={this.onEnter.bind(this)} />
                    <Route path="/addgame" component={AddGame} onEnter={this.onEnter.bind(this)} />
                    <Route path="/gametype" component={GameType} onEnter={this.onEnter.bind(this)} />
                    <Route path="/gamesupplier" component={GameSupplier} onEnter={this.onEnter.bind(this)} />
                    {/* 交易 */}
                    <Route path="/transaction" component={Transaction} onEnter={this.onEnter.bind(this)} />
                    <Route path="/appeallist" component={AppealList} onEnter={this.onEnter.bind(this)} />
                    <Route path="/appealinfo/:appealId" component={AppealInfo} onEnter={this.onEnter.bind(this)} />
                    {/* 人工认证审核 */}
                    <Route path="/authentication" component={AuthenticationList} onEnter={this.onEnter.bind(this)} />
                    <Route path="/authenticationDetails" component={AuthenticationDetails} onEnter={this.onEnter.bind(this)} />
                    {/* 分红提现审核 */}
                    <Route path="/withdraw" component={WithDraw} onEnter={this.onEnter.bind(this)} />
                    {/* 管理员 */}
                    <Route path="/admin" component={AdminList} onEnter={this.onEnter.bind(this)} />
                    <Route path="/adminright" component={AdminRight} onEnter={this.onEnter.bind(this)} />
                    <Route path="/admincreate" component={AdminCreate} onEnter={this.onEnter.bind(this)} />
                    <Route path="/role" component={RoleList} onEnter={this.onEnter.bind(this)} />
                    <Route path="/adminrightoperation/:roleId/:roleName" component={AdminRightOperation} onEnter={this.onEnter.bind(this)} />
                    {/* APP 配置 */}
                    <Route path="/systembanner" component={SystemBanner} onEnter={this.onEnter.bind(this)} />
                    <Route path="/auctioncity" component={AuctionCity} onEnter={this.onEnter.bind(this)} />
                    <Route path="/auctioncityinfo/:cOId" component={AuctionCityInfo} onEnter={this.onEnter.bind(this)} />
                    <Route path="/auctioncitycreate" component={AuctionCityCreate} onEnter={this.onEnter.bind(this)} />
                    {/* 风险管理 */}
                    <Route path="/riskmining" component={RiskMining} onEnter={this.onEnter.bind(this)} />
                    <Route path="/riskstar" component={RiskStar} onEnter={this.onEnter.bind(this)} />
                    <Route path="/risktransaction" component={RiskTransaction} onEnter={this.onEnter.bind(this)} />
                    <Route path="/riskmininguserList/:miningId/:status" component={RiskMiningUserList} onEnter={this.onEnter.bind(this)} />
                    <Route path="/riskstaruserlist/:level" component={RiskStarUserList} onEnter={this.onEnter.bind(this)} />
                    <Route path="/risklocation" component={RiskLocation} onEnter={this.onEnter.bind(this)} />
                    <Route path="/risklog" component={RiskLog} onEnter={this.onEnter.bind(this)} />
                </Route>
                {/* 权限 */}
                <Route path="/login" component={Login} />
            </Router>
        )
    }
}

const mapStateToProps = state => ({
    isLogged: state.user.isLogged,
    userId: state.user.userId,
    username: state.user.username,
    rights: state.user.rights,
    expiredTime: state.user.expiredTime    
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
