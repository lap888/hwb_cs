/*
 * @Author: fantao.meng 
 * @Date: 2019-02-20 00:10:45 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-13 18:09:32
 */

import { Link } from 'react-router';
import echarts from 'echarts';
import { Layout, Menu, Icon, Button, Breadcrumb, Row, Col, Statistic } from 'antd';
import { connect } from 'react-redux';
import { HOME_OPTIONS } from '../constants/home';
import { Colors } from 'theme';
import { Send } from 'HttpPost';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 用户量统计
            userAmounts: "--",
            auUserAmounts: "--",
            // 订单统计
            orderAmounts: "--",
            orderGemAmounts: "--",
            orderPriceAmount: "--",
            // 图表-用户量
            userDataX: [],
            userDataY: [],
            userDateAuthY: [],
            // 图表
            gemAmounts: "--",
            gemTodayAmounts: "--",
            gemDataX: [],
            gemMinningDataY: [],
            gemCoinDataY: [],
            gemGameDataY: [],
            feeAmounts: "--",
            feeTodayAmounts: "--",
            orderDataX: [],             //订单交易 X
            orderAmountDataY: [],       //近七日订单成交量
            gemAmountsDataY: [],        //近七日钻石成交数
            gemAvgDataY: [],            //近七日钻石平均价格
        }
        this.clientChartElement = null;
        this.transactionChartElement = null;
        this.rechargeChartElement = null;
    }

    componentDidMount() {

        // 平台用户量统计
        Send("User.userCount", { _uid: this.props.userId }, response => {
            let { userAmounts, auUserAmounts } = response['data'];
            this.setState({ userAmounts, auUserAmounts });
        });

        // 交易手续费统计
        Send('Order.feeAccount', { _uid: this.props.userId }, response => {
            let { feeAmounts, feeTodayAmounts } = response['data'];
            this.setState({ feeAmounts, feeTodayAmounts });
        });

        // 成交订单统计
        Send('Order.orderAmounts', { _uid: this.props.userId }, response => {
            let { orderAmounts, orderGemAmounts, orderPriceAmount  } = response['data'];
            this.setState({ orderAmounts, orderGemAmounts, orderPriceAmount });
        });

        //获取钻石
        Send('Gem.gemAllAmounts', { _uid: this.props.userId }, result => {
            //新增钻石
            Send('Gem.gemTodayAmounts', { _uid: this.props.userId }, result => {
                this.setState({
                    gemTodayAmounts: parseInt(result.data.gemAmounts == null ? 0 : result.data.gemAmounts)
                });
            });
            this.setState({
                gemAmounts: parseInt(result.data.gemAmounts)
            });
        });

        // 初始化图表
        setTimeout(() => {
            this.initCharts();
        }, 0);
    }

    /**
     * 初始化图表组件
     */
    initCharts() {
        // 初始化用户图表组件
        !this.clientChartElement && this.clientChart && (this.clientChartElement = echarts.init(this.clientChart, {}, { width: this.clientChart.clientWidth, height: this.clientChart.clientWidth * 0.33 }));
        this.setClientChartElement();
        // 初始化交易图表组件
        !this.transactionChartElement && this.transactionChart && (this.transactionChartElement = echarts.init(this.transactionChart, {}, { width: this.transactionChart.clientWidth, height: this.transactionChart.clientWidth * 0.33 }));
        this.setTransactionChartElement();
        // 初始化充值图表组件
        !this.rechargeChartElement && this.rechargeChart && (this.rechargeChartElement = echarts.init(this.rechargeChart, {}, { width: this.rechargeChart.clientWidth, height: this.rechargeChart.clientWidth * 0.33 }));
        this.setRechargeChartElement();

        this.SendLoadUserData();
        this.SendLoadGemData();
        this.SendLoadOrderData();
    }

    SendLoadOrderData = () => {
        //近七日订单成交量
        Send('Order.nearDayOrderAmounts', { day: 7, _uid: this.props.userId }, result => {
            let _dataX = [];
            let _orderAmountDataY = [];
            let _gemAmountsDataY = [];
            let _gemAvgDataY = [];
            result.data.sort().map((value, index) => {
                _dataX.push(value.ctime);
                _orderAmountDataY.push(value.amounts);
            });
            this.setState({
                orderDataX: _dataX,
                orderAmountDataY: _orderAmountDataY,
            }, () => {
                this.setRechargeChartElement();
            });
            //近七日钻石成交数
            Send('Order.nearDayGemAmounts', { day: 7, _uid: this.props.userId }, result => {
                result.data.sort().map((value, index) => {
                    if (index < _orderAmountDataY.length) {
                        _gemAmountsDataY.push(value.amounts)
                    }
                });
                this.setState({
                    gemAmountsDataY: _gemAmountsDataY,
                }, () => {
                    this.setRechargeChartElement();
                });
            });
            //近七日钻石平均价格 
            Send('Order.nearDayGemAvgAmounts', { day: 7, _uid: this.props.userId }, result => {
                result.data.sort().map((value, index) => {
                    if (index < _orderAmountDataY.length) {
                        _gemAvgDataY.push(value.amounts)
                    }
                });
                this.setState({
                    gemAvgDataY: _gemAvgDataY,
                }, () => {
                    this.setRechargeChartElement();
                });
            });
        });
    }

    SendLoadUserData = () => {
        // 近七日用户新增数据
        Send('User.sevenDayUserCounts', { _uid: this.props.userId }, response => {
            let { list, listAuth } = response['data'];
            let _dataX = [];
            let _dataY = [];
            let _dataAuthY = [];
            list.map((value, index) => {
                _dataX.push(value.ctime);
                _dataY.push(value.counts);
                _dataAuthY.push(listAuth[index]['counts']);
            });
            this.setState({
                userDataX: _dataX,
                userDataY: _dataY,
                userDateAuthY: _dataAuthY,
            }, () => {
                this.setClientChartElement();
            });
        });
    }

    SendLoadGemData = () => {
        // 七日钻石交易 消耗
        Send('Gem.CoinSubGem', { _uid: this.props.userId }, result => {
            let _dataX = [];
            let _coinDataY = [];
            let _minningDataY = [];
            let _gameDataY = [];
            result.data.sort().map((value, index) => {
                _dataX.push(value.ctime);
                _coinDataY.push(value.fee);
            });
            this.setState({
                gemDataX: _dataX,
                gemCoinDataY: _coinDataY,
            }, () => {
                this.setTransactionChartElement();
            });
            // 兑换矿机消耗
            Send('Gem.MinningSubGem', { _uid: this.props.userId }, result => {
                result.data.sort().map((value, index) => {
                    if (index < _coinDataY.length) {
                        _minningDataY.push(value.gems)
                    }
                });
                this.setState({
                    gemMinningDataY: _minningDataY,
                }, () => {
                    this.setTransactionChartElement();
                });
            });
            //游戏分红消耗
            Send('Gem.GameSubGem', { _uid: this.props.userId }, result => {
                result.data.sort().map((value, index) => {
                    if (index < _coinDataY.length) {
                        _gameDataY.push(value.gem)
                    }
                });
                this.setState({
                    gemGameDataY: _gameDataY,
                }, () => {
                    this.setTransactionChartElement();
                });
            });
        });
    }

    /**
     * 设置用户图表
     */
    setClientChartElement() {
        // 指定图表的配置项和数据
        var option = {
            // 标题
            title: { id: "clientChart", text: '最近一周用户新增', textStyle: { color: Colors.C1 }, padding: [20, 20, 20, 20] },
            xAxis: { type: 'category', data: this.state.userDataX, axisLine: { lineStyle: { color: Colors.C0 } }, axisLabel: { color: Colors.C1 } },
            yAxis: { type: "value", splitNumber: 5, axisLine: { lineStyle: { color: Colors.C0 } }, axisLabel: { color: Colors.C1 }, splitLine: { lineStyle: { color: Colors.C0, width: 0.5, type: "dashed" } } },
            tooltip: {
                textStyle: { fontSize: 14, color: Colors.C8 },
            },
            toolbox: {
                feature: {
                    saveAsImage: {
                        pixelRatio: 2
                    }
                },
                right: 20,
            },
            legend: {
                padding: [20, 20, 20, 20],
                data: [
                    {  
                        name: "用户每日新增", icon: "circle", textStyle: { color: "#e5a8ed" } 
                    }, {
                        name: "用户每日新增实名", icon: "circle", textStyle: { color: "#e9a3a5" },
                    }
                ],
            },
            series: [{
                type: 'line',
                name: '用户每日新增',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#e5a8ed',
                        lineStyle: {
                            color: '#e5a8ed'
                        }
                    }
                },
                data: this.state.userDataY
            },{
                type: 'line',
                name: '用户每日新增实名',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#e9a3a5',
                        lineStyle: {
                            color: '#e9a3a5'
                        }
                    }
                },
                data: this.state.userDateAuthY
            }]
        };

        this.clientChartElement.setOption(option);
    }

    /**
     * 设置交易图表
     */
    setTransactionChartElement() {
        // 指定图表的配置项和数据
        var option = {
            // 标题
            title: { id: "transactionChart", text: '最近一周钻石消耗', textStyle: { color: Colors.C1 }, padding: [20, 20, 20, 20] },
            xAxis: { type: 'category', data: this.state.gemDataX, axisLine: { lineStyle: { color: Colors.C0 } }, axisLabel: { color: Colors.C1 } },
            yAxis: { type: "value", splitNumber: 5, axisLine: { lineStyle: { color: Colors.C0 } }, axisLabel: { color: Colors.C1 }, splitLine: { lineStyle: { color: Colors.C0, width: 0.5, type: "dashed" } } },
            tooltip: {
                textStyle: { fontSize: 14, color: Colors.C8 },
                formatter: function (params, ticket, callback) {
                    let { seriesIndex, seriesName, name, data, value } = params;
                    return `【${name}】${seriesIndex === 0 ? '抵扣消耗' + value + '枚' : seriesIndex === 1 ? `交易消耗${value}枚` : '兑换消耗' + value + '枚'}`;
                }
            },
            legend: {
                padding: [20, 20, 20, 20],
                data: [
                    {
                        name: "抵扣消耗", icon: "circle", textStyle: { color: "e5a8ed" },
                    }, {
                        name: "交易消耗", icon: "circle", textStyle: { color: "76e3a0" },
                    }, {
                        name: "兑换消耗", icon: "circle", textStyle: { color: "e9a3a5" },
                    }
                ],
            },
            toolbox: {
                feature: {
                    saveAsImage: {
                        pixelRatio: 2
                    }
                },
                right: 20,
            },
            series: [
                {
                    type: 'line',
                    name: "抵扣消耗",
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#97caf5',
                            lineStyle: {
                                color: '#97caf5'
                            }
                        }
                    },
                    data: this.state.gemGameDataY//[1300, 2838, 4900, 1891, 1190, 1899, 5009]
                }, {
                    type: 'line',
                    name: "交易消耗",
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#76e3a0',
                            lineStyle: {
                                color: '#76e3a0'
                            }
                        }
                    },
                    data: this.state.gemCoinDataY//[2600, 5570, 9200, 3579, 2300, 3801, 10000]
                },
                {
                    type: 'line',
                    name: "兑换消耗",
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#e9a3a5',
                            lineStyle: {
                                color: '#e9a3a5'
                            }
                        }
                    },
                    data: this.state.gemMinningDataY//[260, 550, 900, 579, 230, 381, 1000]
                }
            ]
        };

        this.transactionChartElement.setOption(option);
    }

    /**
     * 设置充值图表-最近一周交易数据
     */
    setRechargeChartElement() {
        // 指定图表的配置项和数据
        var option = {
            // 标题
            title: { id: "rechargeChart", text: '最近一周交易数据', textStyle: { color: Colors.C1 }, padding: [20, 20, 20, 20] },
            xAxis: { type: 'category', data: this.state.orderDataX, axisLine: { lineStyle: { color: Colors.C0 } }, axisLabel: { color: Colors.C1 } },
            yAxis: { type: "value", splitNumber: 5, axisLine: { lineStyle: { color: Colors.C0 } }, axisLabel: { color: Colors.C1 }, splitLine: { lineStyle: { color: Colors.C0, width: 0.5, type: "dashed" } } },
            tooltip: {
                formatter: function (params, ticket, callback) {
                    let { seriesIndex, seriesName, name, data, value } = params;
                    return `【${name}】${seriesIndex === 0 ? '订单成交量' + value + '单' : seriesIndex === 1 ? `钻石成交数${value}枚` : '钻石平均价格' + value + '刀'}`;
                },
                textStyle: { fontSize: 14, color: Colors.C8 },
            },
            toolbox: {
                feature: {
                    saveAsImage: {
                        pixelRatio: 2
                    }
                },
                right: 20,
            },
            legend: {
                padding: [20, 20, 20, 20],
                data: [
                    {
                        name: "订单成交量", icon: "circle", textStyle: { color: "#e5a8ed" },
                    }, {
                        name: "钻石成交数", icon: "circle", textStyle: { color: "#76e3a0" },
                    }, {
                        name: "钻石平均价格", icon: "circle", textStyle: { color: "#e9a3a5" },
                    }
                ],
            },
            series: [{
                type: 'line',
                name: "订单成交量",
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#e5a8ed',
                        lineStyle: {
                            color: '#e5a8ed'
                        }
                    }
                },
                data: this.state.orderAmountDataY//[1300, 2838, 4900, 1891, 1190, 1899, 5009]
            }, {
                type: 'line',
                name: "钻石成交数",
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#76e3a0',
                        lineStyle: {
                            color: '#76e3a0'
                        }
                    }
                },
                data: this.state.gemAmountsDataY//[1300, 2838, 4900, 1891, 1190, 1899, 5009]
            }, {
                type: 'line',
                name: "钻石平均价格",
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#e9a3a5',
                        lineStyle: {
                            color: '#e9a3a5'
                        }
                    }
                },
                data: this.state.gemAvgDataY//[1300, 2838, 4900, 1891, 1190, 1899, 5009]
            }]
        };

        this.rechargeChartElement.setOption(option);
    }

    /**
     * 渲染用户图表
     */
    renderClientChart() {
        return (
            <Row type="flex" justify="start">
                <Col span={18}>
                    <div ref={e => { if (e) this.clientChart = e }} style={Styles.chart} />
                </Col>
                <div style={{ ...Styles.chartBar, flex: 1, backgroundColor: '#e5a8ed60' }}>
                    <div style={{ marginRight: 10, padding: '25px 25px 25px 25px', display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', background: '#fff' }}>
                        <Icon type={"rocket"} style={{ fontSize: 32, color: "#e5a8ed" }} />
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 15 }}>
                            <p style={{ fontSize: 16 }}>{`用户总量 ${this.state.userAmounts}`}</p>
                            <p style={{ fontSize: 14 }}>{`实名用户 ${this.state.auUserAmounts}`}</p>
                            <p style={{ fontSize: 14 }}>{`总交易手续费 ${this.state.feeAmounts}`}</p>
                            <p style={{ fontSize: 14 }}>{`今日交易手续费 ${this.state.feeTodayAmounts}`}</p>
                        </div>
                    </div>
                </div>
            </Row>
        )
    }

    /**
     * 渲染交易图表
     */
    renderTransactionChart() {
        return (
            <Row type="flex" justify="start">
                <Col span={18}>
                    <div ref={e => { if (e) this.transactionChart = e }} style={Styles.chart} />
                </Col>
                <div style={{ ...Styles.chartBar, backgroundColor: '#76e3a060' }}>
                    <div style={{ marginRight: 10, padding: '25px 25px 25px 25px', display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', background: '#76e3a0' }}>
                        <Icon type={"fire"} style={{ fontSize: 32, color: "#e5a8ed" }} />
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 15 }}>
                            <p style={{ fontSize: 16 }}>{`钻石总量 ${this.state.gemAmounts}`}</p>
                            <p style={{ fontSize: 14 }}>{`日增钻石 ${this.state.gemTodayAmounts}`}</p>
                        </div>
                    </div>
                </div>
            </Row>
        )
    }

    /**
     * 渲染充值图表
     */
    renderRechargeChart() {
        return (
            <Row type="flex" justify="start">
                <Col span={18}>
                    <div ref={e => { if (e) this.rechargeChart = e }} style={Styles.chart} />
                </Col>
                <div style={{ ...Styles.chartBar, backgroundColor: '#e9a3a560' }}>
                    <div style={{ marginRight: 10, padding: '25px 25px 25px 25px', display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', background: '#e9a3a5' }}>
                        <Icon type={"book"} style={{ fontSize: 32, color: "#e5a8ed" }} />
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 15 }}>
                            <p style={{ fontSize: 16 }}>{`成交订单数 ${this.state.orderAmounts}`}</p>
                            <p style={{ fontSize: 14 }}>{`成交钻石数 ${this.state.orderGemAmounts}枚`}</p>
                            <p style={{ fontSize: 14 }}>{`成交额 ¥${this.state.orderPriceAmount}`}</p>
                        </div>
                    </div>
                </div>
            </Row>
        )
    }

    render() {
        return (
            <div>
                {this.renderClientChart()}
                {this.renderTransactionChart()}
                {this.renderRechargeChart()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId
});

export default connect(mapStateToProps, {})(Home);

const Styles = {
    chart: { marginTop: 10, backgroundColor: '#FFFFFF' },
    chartBar: { display: 'flex', flex: 1, margin: '10px 0 0 10px' },
}
