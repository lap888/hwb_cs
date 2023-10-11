/*
 * @Author: fantao.meng 
 * @Date: 2019-03-20 20:28:23 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-10 11:23:47
 */

import { Table, Card, Col, Row } from 'antd';
import { Send } from 'HttpPost';
import { TRANSACTION_STATUS } from 'constantclient';

export default class ClientTransaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            currentPage: 1,
            totalNumber: 1,
            transactionList: [],
            status: 0,

            inNormalNumber: '--',
            bullNumber: '--',
            processingNumber: '--',
            completeNumber: '--',
            buyAmount: '--',
            sellAmount: '--',
        }
    }

    componentDidMount () {
        this.fetchTransactionStatictics();
        this.fetchTransactionList(1);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.clientId !== this.props.clientId) {
            this.fetchTransactionStatictics(nextProps.clientId);
            this.fetchTransactionList(1, nextProps.clientId);
        }
    }

    /**
     * 获取交易统计信息
     */
    fetchTransactionStatictics (clientId) {
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('User.getTransactionStatictics', { clientId: clientId || this.props.clientId, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { inNormalNumber, bullNumber, processingNumber, completeNumber, buyAmount, sellAmount } = response['data'];
                that.setState({ inNormalNumber, bullNumber, processingNumber, completeNumber, buyAmount, sellAmount  });
            }
        });
    }

    /**
     * 获取交易列表
     */
    fetchTransactionList (page, clientId) {
        var that = this;
        Send('User.getTransactionList', { status: this.state.status, page, clientId: clientId || this.props.clientId, _uid: this.props.userId }, response => {
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                that.setState({ currentPage: page, transactionList: list, totalNumber });
            }
        });
    }

    /**
     * 切换交易状态
     */
    onChangeStatus (status) {
        if (status !== this.state.status) this.setState({ status }, () => this.fetchTransactionList(1));
    }

    renderTab () {
        let { inNormalNumber, bullNumber, processingNumber, completeNumber, buyAmount, sellAmount } = this.state;
        return (
            <div style={{ background: '#ECECEC', padding: '26px' }}>
                <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
                    <div style={{ display: 'flex', flex: 1 }}>
                        <Card style={{ width: '100%' }} title="异常订单" bordered={false} hoverable onClick={() => this.onChangeStatus(0)} extra={<p style={{ color: '#1890ff' }}>列表</p>}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${inNormalNumber}`}</p>
                                <p style={{ fontSize: 16 }}>{`单`}</p>
                            </div>
                        </Card>
                    </div>
                    <div style={{ display: 'flex', flex: 1, marginLeft: '26px' }}>
                        <Card style={{ width: '100%' }} title="买单" bordered={false} hoverable onClick={() => this.onChangeStatus(1)} extra={<p style={{ color: '#1890ff' }}>列表</p>}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${bullNumber}`}</p>
                                <p style={{ fontSize: 16 }}>{`单`}</p>
                            </div>
                        </Card>
                    </div>
                    <div style={{ display: 'flex', flex: 1, marginLeft: '26px' }}>
                        <Card style={{ width: '100%' }}  title="交易中" bordered={false} hoverable onClick={() => this.onChangeStatus(2)} extra={<p style={{ color: '#1890ff' }}>列表</p>}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${processingNumber}`}</p>
                                <p style={{ fontSize: 16 }}>{`单`}</p>
                            </div>
                        </Card>
                    </div>
                    <div style={{ display: 'flex', flex: 1, marginLeft: '26px' }}>
                        <Card style={{ width: '100%' }}  title="交易完成" bordered={false} hoverable onClick={() => this.onChangeStatus(3)} extra={<p style={{ color: '#1890ff' }}>列表</p>}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${completeNumber}`}</p>
                                <p style={{ fontSize: 16 }}>{`单`}</p>
                            </div>
                        </Card>
                    </div>
                    <div style={{ display: 'flex', flex: 1, marginLeft: '26px' }}>
                        <Card style={{ width: '100%' }}  title="累计购买钻石" bordered={false} hoverable>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${buyAmount}`}</p>
                                <p style={{ fontSize: 16 }}>{`枚`}</p>
                            </div>
                        </Card>
                    </div>
                    <div style={{ display: 'flex', flex: 1, marginLeft: '26px' }}>
                        <Card style={{ width: '100%' }}  title="累计出售钻石" bordered={false} hoverable>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${sellAmount}`}</p>
                                <p style={{ fontSize: 16 }}>{`枚`}</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    renderTable () {
        const columns = [
            {
                title: '交易单号',
                dataIndex: 'tradeNumber',
                key: 'tradeNumber',
                width: '150px',
                fixed: 'left'
            },{
                title: '买家用户名',
                dataIndex: 'buyerName',
                key: 'buyerName',
                width: '200px',
                render: (text, record) => (
                    <a onClick={() => this.props.router.push({ pathname: `/clientinfo/${record['buyerUid']}` })}>{text}</a>
                ),
            },{
                title: '买家支付宝',
                dataIndex: 'buyerAlipay',
                key: 'buyerAlipay',
                width: '150px',
            },{
                title: '卖家用户名',
                dataIndex: 'sellerName',
                key: 'sellerName',
                width: '200px',
                render: (text, record) => (
                    <a onClick={() => this.props.router.push({ pathname: `/clientinfo/${record['sellerUid']}` })}>{text}</a>
                ),
            },{
                title: '卖家支付宝',
                dataIndex: 'sellerAlipay',
                key: 'sellerAlipay',
                width: '150px',
            },{
                title: '单价',
                dataIndex: 'price',
                key: 'price',
                width: '150px',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`$${text}`}</p>
                )
            },{
                title: '数量',
                dataIndex: 'amount',
                key: 'amount',
                width: '150px',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${record['amount']}枚`}</p>
                )
            },{
                title: '总价',
                dataIndex: 'totalPrice',
                key: 'totalPrice',
                width: '150px',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`¥${text}`}</p>
                )
            },{
                title: '手续费',
                dataIndex: 'fee',
                key: 'fee',
                width: '150px',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${text}枚`}</p>
                )
            },{
                title: '挂单时间',
                dataIndex: 'entryOrderTime',
                key: 'entryOrderTime',
                width: '250px',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${text ? moment(text).format('YYYY年MM月DD日 HH时mm分') : "--"}`}</p>
                )
            },{
                title: '接单时间',
                dataIndex: 'dealTime',
                key: 'dealTime',
                width: '250px',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${text ? moment(text).format('YYYY年MM月DD日 HH时mm分') : "--"}`}</p>
                )
            },{
                title: '支付时间',
                dataIndex: 'paidTime',
                key: 'paidTime',
                width: '250px',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${text ? moment(text).format('YYYY年MM月DD日 HH时mm分') : "--"}`}</p>
                )
            },{
                title: '申诉时间',
                dataIndex: 'appealTime',
                key: 'appealTime',
                width: '250px',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${text ? moment(text).format('YYYY年MM月DD日 HH时mm分') : "--"}`}</p>
                )
            },{
                title: '放币时间',
                dataIndex: 'payCoinTime',
                key: 'payCoinTime',
                width: '250px',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${text ? moment(text).format('YYYY年MM月DD日 HH时mm分') : "--"}`}</p>
                )
            },{
                title: '交易状态',
                dataIndex: 'status',
                key: 'status',
                width: '200px',
                fixed: 'right',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${TRANSACTION_STATUS[record['status']]['value']}${this.state.status === 0 && record['sellerUid'] ? (record['pictureUrl'] ? "【申诉驳回】" : "【支付超时】") : ""}`}</p>
                )
            }
        ];
        return (
            <Table columns={columns} dataSource={this.state.transactionList}
                rowKey='id'
                loading={this.state.isLoading}
                onChange={(page, pageSize) => this.fetchTransactionList(page.current)}
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }} 
                scroll={{ x: "2900px" }}
            />
        )
    }

    render () {
        return (
            <div>
                {this.renderTab()}
                {this.renderTable()}
            </div>
        )
    }
}