/*
 * @Author: fantao.meng 
 * @Date: 2019-03-20 20:28:23 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-14 14:10:23
 */

import { Table, Card, Col, Row, Tabs } from 'antd';
import { connect } from 'react-redux';
import { Send } from 'HttpPost';
import { MINING_TYPE_LIST, MINING_SOURCE_LIST } from 'constantclient';

class AuctionCityInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            currentPage: 1,
            totalNumber: 1,

            // 统计信息
            gameBounds: "--",
            gameTodayBounds: "--",
            
            gemBounds: "--",
            gemTodayBounds: "--",

            inCome: "--",
            todayIncome: "--",
            inComeRate: "--",

            buyCount: "--",
            sellerCount: "--",

            newCount: "--",
            totalCount: "--",

            // 列表
            cityProfileList: [],
            gemBoundList: [],
            gameBoundList: [],

            // tabs
            activeKey: "1"
        }
    }

    componentDidMount () {
        this.fetchCityStatictics();
        this.fetchCityProfileList();
    }

    /**
     * 获取城市统计信息
     */
    fetchCityStatictics () {
        var that = this;
        Send('CityAuction.cityOwnersDetails', { cOId: this.props.params.cOId, _uid: this.props.userId }, response => {
            if (response['success']) {
                let { gameBounds, gameTodayBounds, gemBounds, gemTodayBounds, inCome, todayIncome, inComeRate, buyCount, sellerCount, newCount, totalCount } = response['data'];
                that.setState({ gameBounds, gameTodayBounds, gemBounds, gemTodayBounds, inCome, todayIncome, inComeRate, buyCount, sellerCount, newCount, totalCount });
            }
        });
    }

    /**
     * 获取城市收益列表
     */
    fetchCityProfileList (page) {
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('CityAuction.cityRewardRecord', { page: page || 1, cOId: this.props.params.cOId, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                that.setState({ currentPage: page, cityProfileList: list, totalNumber });
            }
        });
    }

    /**
     * 获取钻石收益列表
     */
    fetchGemBoundList (page) {
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('CityAuction.gemList', { page: page || 1, cOId: this.props.params.cOId, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { gemRecordArr, totalNumber } = response['data'];
                that.setState({ currentPage: page, gemBoundList: gemRecordArr, totalNumber });
            }
        });
    }

    /**
     * 获取游戏分红列表
     */
    fetchGameBoundList (page) {
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('CityAuction.cityGameBounsFlow', { page: page || 1, cOId: this.props.params.cOId, _uid: this.props.userId, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { balanceFlow, totalNumber } = response['data'];
                that.setState({ currentPage: page, gameBoundList: balanceFlow, totalNumber });
            }
        });
    }

    /**
     * 切换Tabs
     */
    onChangeStatus (activeKey) {
        if (activeKey !== this.state.activeKey) {
            this.setState({ activeKey }, () => {
                switch (activeKey) {
                    case "1":
                        this.fetchCityProfileList();
                        break;
                    case "2":
                        this.fetchGemBoundList();
                        break;
                    case "3":
                        this.fetchGameBoundList()
                        break;
                    case "4":
                        
                        break;
                    default:
                        break;
                }
            });
        }
    }

    /**
     * 渲染收益统计信息
     */
    renderCard () {
        let { gameBounds, gameTodayBounds, gemBounds, gemTodayBounds, inCome, todayIncome, inComeRate, buyCount, sellerCount, newCount, totalCount } = this.state;
        return (
            <div style={{ background: '#ECECEC', padding: '26px' }}>
                <Row gutter={24}>
                    <Col span={6} onClick={() => this.onChangeStatus("1")}>
                        <Card title="城市收益" bordered={false} hoverable extra={<p style={{ color: '#1890ff' }}>列表</p>}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={Styles.tabLabel}>{`历史收益`}</p>
                                <p style={Styles.tabLabelText}>{`¥${inCome}`}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={Styles.tabLabel}>{`今日收益`}</p>
                                <p style={Styles.tabLabelText}>{`¥${todayIncome}`}</p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={6} onClick={() => this.onChangeStatus("2")}>
                        <Card title="钻石分红" bordered={false} hoverable extra={<p style={{ color: '#1890ff' }}>列表</p>}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={Styles.tabLabel}>{`历史收益`}</p>
                                <p style={Styles.tabLabelText}>{`${gemBounds}枚`}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={Styles.tabLabel}>{`今日收益`}</p>
                                <p style={Styles.tabLabelText}>{`${gemTodayBounds}枚`}</p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={6} onClick={() => this.onChangeStatus("3")}>
                        <Card title="游戏分红" bordered={false} hoverable extra={<p style={{ color: '#1890ff' }}>列表</p>}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={Styles.tabLabel}>{`历史收益`}</p>
                                <p style={Styles.tabLabelText}>{`¥${gameBounds}`}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={Styles.tabLabel}>{`今日收益`}</p>
                                <p style={Styles.tabLabelText}>{`¥${gameTodayBounds}`}</p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={6} onClick={() => this.onChangeStatus("4")}>
                        <Card title="城市人数" bordered={false} hoverable>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={Styles.tabLabel}>{`历史人数`}</p>
                                <p style={Styles.tabLabelText}>{`${totalCount}人`}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={Styles.tabLabel}>{`今日新增`}</p>
                                <p style={Styles.tabLabelText}>{`¥${newCount}人`}</p>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }

    /**
     * 渲染收益Tabs
     */
    renderTabs () {
        return (
            <Tabs activeKey={this.state.activeKey}>
                <Tabs.TabPane tab="" key="1">{this.renderCityProfileTable()}</Tabs.TabPane>
                <Tabs.TabPane tab="" key="2">{this.renderDiamondTable()}</Tabs.TabPane>
                <Tabs.TabPane tab="" key="3">{this.renderGameBoundTable()}</Tabs.TabPane>
                <Tabs.TabPane tab="" key="4">
                    Content of Tab Pane 4
                </Tabs.TabPane>
            </Tabs>
        )
    }

    /**
     * 渲染城市收益流水
     */
    renderCityProfileTable () {
        const columns = [
            {
                title: '当日收益',
                dataIndex: 'id',
                key: 'id',
                width: '15%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${record['gameBonus'] + record['gemAmount']}`}</p>
                )
            },{
                title: '游戏分红',
                dataIndex: 'gameBonus',
                key: 'gameBonus',
                width: '15%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`¥${text}`}</p>
                )
            },{
                title: '钻石分红',
                dataIndex: 'gemAmount',
                key: 'gemAmount',
                width: '15%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`¥${text}`}</p>
                )
            },{
                title: '钻石数量',
                dataIndex: 'gem',
                key: 'gem',
                width: '15%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${text}枚`}</p>
                )
            },{
                title: '当日钻石均价',
                dataIndex: 'avgPrice',
                key: 'avgPrice',
                width: '15%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`¥${text}`}</p>
                )
            },{
                title: '创建时间',
                dataIndex: 'createdAt',
                key: 'createdAt',
                width: '15%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${moment(text).format('YYYY年MM月DD日 HH时mm分')}`}</p>
                )
            }
        ];
        return (
            <Table columns={columns} dataSource={this.state.cityProfileList}
                rowKey='id'
                loading={this.state.isLoading}
                onChange={(page, pageSize) => this.fetchCityProfileList(page.current)}
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }} 
            />
        )
    }

    /**
     * 渲染钻石流水
     */
    renderDiamondTable () {
        const columns = [
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                width: '60%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${text}`}</p>
                )
            },{
                title: '分红数量',
                dataIndex: 'num',
                key: 'num',
                width: '20%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${text}枚`}</p>
                )
            },{
                title: '创建时间',
                dataIndex: 'created_at',
                key: 'created_at',
                width: '20%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${moment(text).format('YYYY年MM月DD日 HH时mm分')}`}</p>
                )
            }
        ];
        return (
            <Table columns={columns} dataSource={this.state.gemBoundList}
                rowKey='id'
                loading={this.state.isLoading}
                onChange={(page, pageSize) => this.fetchGemBoundList(page.current)}
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }} 
            />
        )
    }

    /**
     * 渲染游戏分红流水
     */
    renderGameBoundTable () {
        const columns = [
            {
                title: '来源',
                dataIndex: 'tag',
                key: 'tag',
                width: '15%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${text}`}</p>
                )
            },{
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                width: '45%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${text}`}</p>
                )
            },{
                title: '分红数量',
                dataIndex: 'amount_change',
                key: 'amount_change',
                width: '20%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`¥${text}`}</p>
                )
            },{
                title: '创建时间',
                dataIndex: 'created_at',
                key: 'created_at',
                width: '20%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${moment(text).format('YYYY年MM月DD日')}`}</p>
                )
            }
        ];
        return (
            <Table columns={columns} dataSource={this.state.gameBoundList}
                rowKey='id'
                loading={this.state.isLoading}
                onChange={(page, pageSize) => this.fetchGameBoundList(page.current)}
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }} 
            />
        )
    }

    render () {
        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', background: '#FFFFFF' }}>
                {this.renderCard()}
                {this.renderTabs()}
                {/* {this.renderTable()} */}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId
});

export default connect(mapStateToProps, {})(AuctionCityInfo);

const Styles = {
    tabLabel: { fontSize: 16 },
    tabLabelText: { marginLeft: 10, fontSize: 16 },
}

