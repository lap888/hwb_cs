/*
 * @Author: fantao.meng 
 * @Date: 2019-03-20 20:28:23 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-01 01:19:57
 */

import { Table, Card, Col, Row } from 'antd';
import { Send } from 'HttpPost';
import MathFloat from 'MathFloat'
import { WITHDRAW_TYPE, WITHDRAW_STATUS } from 'constantclient';

export default class ClientDividend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            currentPage: 1,
            totalNumber: 1,
            dividendList: [],
            withdrawList: [],
            
            balanceNormal: 0,
            balanceLock: 0,
            withDrawNumber: 0,

            tabKey: true,
        }
    }

    componentDidMount () {
        this.fetchDividendStatictics();
        this.fetchDividendList(1);
    }

    /**
     * 获取分红统计信息
     */
    fetchDividendStatictics () {
        var that = this;
        Send('User.getDividendStatictics', { clientId: this.props.clientId, _uid: this.props.userId }, response => {
            if (response['success']) {
                let { balanceNormal, balanceLock, withDrawNumber } = response['data'];
                that.setState({ balanceNormal, balanceLock, withDrawNumber });
            }
        });
    }

    /**
     * 获取分红列表
     */
    fetchDividendList (page) {
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('User.getDividendList', { page, clientId: this.props.clientId, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                that.setState({ currentPage: page, dividendList: list, totalNumber });
            }
        });
    }

    /**
     * 获取分红提现列表
     */
    fetchWithDrawList (page) {
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('User.getWithDrawList', { page, clientId: this.props.clientId, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                that.setState({ currentPage: page, withdrawList: list, totalNumber });
            }
        });
    }

    /**
     * 切换分红、提现列表
     */
    onChangeTab (flag) {
        if (this.state.tabKey === flag) return;
        this.setState({ tabKey: flag }, () => {
            if (flag) {
                this.fetchDividendList(1);
            } else {
                this.fetchWithDrawList(1);
            }
        });
    }

    /**
     * 渲染统计信息面板
     */
    renderTab () {
        let { balanceNormal, balanceLock, withDrawNumber } = this.state;
        return (
            <div style={{ background: '#ECECEC', padding: '26px' }}>
                <Row gutter={24}>
                    <Col span={6}>
                        <Card title="可提现金额" bordered={false} hoverable extra={<p style={{ color: '#1890ff' }}>账单记录</p>} onClick={() => this.onChangeTab(true)}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${balanceNormal}`}</p>
                                <p style={{ fontSize: 16 }}>{`¥`}</p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="冻结金额" bordered={false} hoverable>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${balanceLock}`}</p>
                                <p style={{ fontSize: 16 }}>{`¥`}</p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="已提现金额" bordered={false} hoverable extra={<p style={{ color: '#1890ff' }}>提现记录</p>} onClick={() => this.onChangeTab(false)}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${withDrawNumber}`}</p>
                                <p style={{ fontSize: 16 }}>{`¥`}</p>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }

    /**
     * 渲染分红列表
     */
    renderDivindedTable () {
        const columns = [
            {
                title: '账单来源',
                dataIndex: 'tag',
                key: 'tag',
                width: '25%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${text}`}</p>
                )
            },{
                title: '金额',
                dataIndex: 'amount',
                key: 'amount',
                width: '20%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`¥${text}`}</p>
                )
            },{
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                width: '35%',
            },{
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: '20%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${moment(record['createTime']).format('YYYY年MM月DD日 HH时mm分')}`}</p>
                )
            }
        ];
        return (
            <Table columns={columns} dataSource={this.state.dividendList}
                rowKey='id'
                loading={this.state.isLoading}
                onChange={(page, pageSize) => this.fetchDividendList(page.current)}
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }} 
            />
        )
    }

    /**
     * 渲染提现列表
     */
    renderWithdrawTable () {
        const columns = [
            {
                title: '提现方式',
                dataIndex: 'withdrawType',
                key: 'withdrawType',
                width: '10%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${WITHDRAW_TYPE[record['withdrawType'] - 1]}`}</p>
                )
            },{
                title: '提现到账账户',
                dataIndex: 'withdrawTo',
                key: 'withdrawTo',
                width: '10%',
            },{
                title: '提现金额',
                dataIndex: 'amount',
                key: 'amount',
                width: '10%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`¥${text}`}</p>
                )
            },{
                title: '描述',
                dataIndex: 'content',
                key: 'content',
                width: '15%',
            },{
                title: '审核进度',
                dataIndex: 'status',
                key: 'status',
                width: '10%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${WITHDRAW_STATUS[record['status']]}`}</p>
                )
            },{
                title: '审核情况',
                dataIndex: 'failReason',
                key: 'failReason',
                width: '15%',
            },{
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: '15%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${moment(record['createTime']).format('YYYY年MM月DD日 HH时mm分')}`}</p>
                )
            }
        ];
        return (
            <Table columns={columns} dataSource={this.state.withdrawList}
                rowKey='id'
                loading={this.state.isLoading}
                onChange={(page, pageSize) => this.fetchWithDrawList(page.current)}
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }} 
            />
        )
    }

    render () {
        return (
            <div>
                {this.renderTab()}
                {this.state.tabKey ? this.renderDivindedTable() : this.renderWithdrawTable()}
            </div>
        )
    }
}