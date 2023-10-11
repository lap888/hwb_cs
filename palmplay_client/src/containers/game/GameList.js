/*
 * @Author: fantao.meng
 * @Date: 2019-02-21 23:08:22
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-04-08 23:36:54
 */
import {Table, Divider, Button,Row,Menu,Icon,Alert} from 'antd';
import { Send } from 'HttpPost';
import {connect} from "react-redux";

class GameList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 'large',
            isLoading: true,
            adminList: [],
            currentPage: 1,
            totalNumber: 1,
            current: 'gameList',
        };
    }
    componentDidMount() {
        this.fetchGameList(1);
    }
    /**
     * 获取游戏列表
     */
    fetchGameList (page) {
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('Game.getGameInfosList', { page, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber,gameTotalNumber,gameTotalRecharge } = response['data'];
                that.setState({ currentPage: page, gameList: list, totalNumber ,gameTotalNumber,gameTotalRecharge});
            }
        });
    }

    handleClick = (e) => {
        console.log(e.key);
        this.setState({
            current: e.key,
        });
    };

    /**
     * 渲染游戏列表
     */
    renderGameList () {
        const data = this.state.gameList;
        const columns = [
            {
                title: "ID",
                dataIndex: 'id',
                key: 'id',
                width: "100px",
                fixed: 'left',
            },
            {
                title: "游戏名称",
                dataIndex: 'g_title',
                key: 'g_title',
                width: "100px",
                fixed: 'left',
            },{
                title: "类型",
                dataIndex: 'g_type',
                key: 'g_type',
                width: "100px",
            },{
                title: "支持平台",
                dataIndex: 'g_platform',
                key: 'g_platform',
                width: "150px",
            },{
                title: "供应商",
                dataIndex: 'game_supplier',
                key: 'game_supplier',
                width: "150px",
            },{
                title: "最新版本",
                dataIndex: 'g_version',
                key: 'g_version',
                width: "150px",
            },{
                title: "游戏大小",
                dataIndex: 'g_size',
                key: 'g_size',
                width: "150px",
                render: (text, record) => (
                    <p>{record['g_size'] ? record['g_size'] + 'M' : ""}</p>
                )
            },{
                title: "支持钻石抵扣",
                dataIndex: 'use_gem',
                key: 'use_gem',
                width: "150px",
                render: (text, record) => (
                    <p>{record['use_gem'] ? '支持' : "不支持"}</p>
                )
            },{
                title: "钻石抵扣百分比",
                dataIndex: 'use_gem_rate',
                key: 'use_gem_rate',
                width: "150px",
                render: (text, record) => (
                    <p>{record['use_gem'] ? record['use_gem_rate'] * 100 + "%" : ""}</p>
                )
            },{
                title: "   首发",
                dataIndex: 'is_first_publish',
                key: 'is_first_publish',
                width: "150px",
                render: (text, record) => (
                    <p>{record['is_first_publish'] ? '首发' : "非首发"}</p>
                )
            },{
                title: "状态",
                dataIndex: 'is_show',
                key: 'is_show',
                width: "150px",
                render: (text, record) => (
                    <p>{record['is_show'] ? '在线' : "已下架"}</p>
                )
            },{
                title: '操作',
                key: 'action',
                width: "150px",
                fixed: 'right',
                render: (text, record) => (
                    <span>
                        <a onClick={()=>this.handleClick("details")}>详情</a>
                        <Divider type="vertical" />
                        <a onClick={() => alert(111)}>编辑</a>
                        <Divider type="vertical" />
                        <a onClick={() => alert(111)} style={{color:'red'}}>删除</a>
                    </span>
                ),
            }];
            return (
                <div>
                    <div style={{ marginBottom: 16 }}>
                        <Button
                            type="primary" href={"#/addgame"} style={{ margin: 10 }}>
                            添加游戏
                        </Button>
                    </div>

                    <Table
                        columns={columns}
                        loading={this.state.isLoading}
                        dataSource={data}
                        rowKey='userId'
                        scroll={{ x: 1500, y: 250 }}
                        pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }}
                        onChange={(page, pageSize) => this. fetchGameList(page.current)}
                    />

                </div>
            )
    }

    /**
     * 渲染游戏人数列表
     */
    renderNumberList () {
        const data = this.state.gameList;
        const gameTotalNumberList = [{
            title: "ID",
            dataIndex: 'id',
            key: 'id',
            width: "15%"
        },{
            title: "游戏名称",
            dataIndex: 'g_title',
            key: 'g_title',
            width: "15%"
        },{
            title: "上线时间",
            dataIndex: 'created_at',
            key: 'created_at',
            width: "20%",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`${moment(record['createTime']).format('YYYY年MM月DD日 HH时mm分')}`}</p>
            )
        },{
            title: "注册人数（人）",
            dataIndex: 'game_number',
            key: 'game_number',
            width: "15%"
        }];
        return (
            <Table
                columns={gameTotalNumberList}
                loading={this.state.isLoading}
                dataSource={data}
                rowKey='userId'
                scroll={{y: 300}}
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }}
                onChange={(page, pageSize) => this. fetchGameList(page.current)}
            />
        )
    }

    /**
     * 渲染游戏充值列表
     */
    gameTotalRechargeList () {
        const data = this.state.gameList;
        const gameTotalRechargeList = [{
            title: "ID",
            dataIndex: 'id',
            key: 'id',
            width: "15%"
        },{
            title: "游戏名称",
            dataIndex: 'g_title',
            key: 'g_title',
            width: "15%"
        },{
            title: "上线时间",
            dataIndex: 'created_at',
            key: 'created_at',
            width: "20%",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`${moment(record['createTime']).format('YYYY年MM月DD日 HH时mm分')}`}</p>
            )
        },{
            title: "充值金额（元）",
            dataIndex: 'game_recharge',
            key: 'game_recharge',
            width: "15%"
        }];
        return (
            <Table
                columns={gameTotalRechargeList}
                loading={this.state.isLoading}
                dataSource={data}
                rowKey='userId'
                scroll={{y: 300}}
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }}
                onChange={(page, pageSize) => this. fetchGameList(page.current)}
            />
        )
    }

    /**
     * 渲染游戏详情列表
     */
    gamedetailsList(){
        return(
            <div>
                <Alert message="Info Text" type="info" />
            </div>
        )
    }

    render () {
        const gameList=this.state.current==="gameList" ? 'block' : 'none';
        const gameNumberList=this.state.current==="gameNumberList" ? 'block' : 'none';
        const gameRechargeList=this.state.current==="gameRechargeList" ? 'block' : 'none';
        const gameDetailsList=this.state.current==="details" ? 'block' : 'none';
        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', background: '#FFFFFF' }}>
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                >
                    <Menu.Item key="gameList">
                        <Icon  />游戏列表
                    </Menu.Item>
                    <Menu.Item key="gameNumberList">
                        <Icon />游戏总人数：（{this.state.gameTotalNumber}）人
                    </Menu.Item>
                    <Menu.Item key="gameRechargeList">
                        <Icon />游戏总充值：（{this.state.gameTotalRecharge}）元
                    </Menu.Item>
                </Menu>
                <div style={{"display":gameList}} >
                    {this.renderGameList()}
                </div>
                <div style={{"display":gameNumberList}}>
                    {this.renderNumberList()}
                </div>
                <div style={{"display":gameRechargeList}}>
                    {this.gameTotalRechargeList()}
                </div>
                <div style={{"display":gameDetailsList}}>
                    {this.gamedetailsList()}
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => ({userId: state.user.userId});
export default connect(mapStateToProps, {})(GameList);
const Styles = {};