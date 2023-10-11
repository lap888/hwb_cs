/*
 * @Author: fantao.meng 
 * @Date: 2019-02-19 23:13:13 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-10 11:24:41
 */

import { Table, Divider, Form, Input, Icon, Select, Button } from 'antd';
import { connect } from 'react-redux';
import { Send } from 'HttpPost';
import { Colors } from 'theme';
import { TRANSACTION_STATUS } from 'constantclient';

class Transaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            currentPage: 1,
            totalNumber: 1,
            transactionList: [],

            buyerAlipay: "",
            sellerAlipay: "",
            status: "6",
        }
    }

    componentDidMount () {
        this.fetchTransactionList(1);
    }

    /**
     * 获取交易列表
     */
    fetchTransactionList (page) {
        var that = this;
        if (!this.state.isLoading) this.setState({ isLoading: true });

        let { buyerAlipay, sellerAlipay, status } = this.state;
        if (status === "6") status = "";
        Send('Trade.tradeList', { buyerAlipay, sellerAlipay, status, page, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                that.setState({ currentPage: page, transactionList: list, totalNumber });
            }
        });
    }

    /**
     * 渲染搜索框
     */
    renderSearchBar () {
        let { buyerAlipay, sellerAlipay, status } = this.state;
        return (
            <div style={{ display: 'flex', margin: '20px', borderWidth: 1, borderRadius: 4, borderColor: 'rgba(0, 0, 0, 0.15)', borderStyle: 'solid' }}>
                <Form style={{ padding: '26px 40px 26px 40px' }} layout="inline">
                    <Form.Item style={Styles.formItem}>
                        <Input
                            autoComplete="new-password"
                            prefix={<Icon type="alipay-circle" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                            placeholder="买家支付宝"
                            value={buyerAlipay}
                            onChange={e => this.setState({ buyerAlipay: e.target.value })} 
                        />
                    </Form.Item>
                    <Form.Item style={Styles.formItem}>
                        <Input
                            autoComplete="new-password"
                            prefix={<Icon type="alipay-circle" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                            placeholder="卖家支付宝" 
                            value={sellerAlipay} 
                            onChange={e => this.setState({ sellerAlipay: e.target.value })} 
                        />
                    </Form.Item>
                    <Form.Item style={Styles.formItem}>
                        <Select defaultValue={status} style={Styles.formItem} onChange={status => this.setState({ status })}>
                            {TRANSACTION_STATUS.map(item => <Select.Option key={item['key']} value={item['key']}>{item['value']}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary" 
                            htmlType="submit"
                            onClick={() => this.fetchTransactionList(1)}> 
                            Search
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }

    /**
     * 渲染交易列表
     */
    renderTable () {
        const columns = [
            {
                title: '交易单号',
                dataIndex: 'tradeNumber',
                key: 'tradeNumber',
                width: '150px',
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
                width: '170px',
                fixed: 'right',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${TRANSACTION_STATUS[record['status']]['value']}${text === 0 && record['sellerUid'] ? (record['pictureUrl'] ? "【申诉驳回】" : "【支付超时】") : ""}`}</p>
                )
            },{
                title: '操作',
                key: 'action',
                width: "150px",
                fixed: 'right',
                render: (text, record) => (
                  <span>
                    <a onClick={() => {}}>详情</a>
                    <Divider type="vertical" />
                    <a onClick={() => {}}>操作</a>
                  </span>
                ),
            }
        ];
        return (
            <Table columns={columns} dataSource={this.state.transactionList}
                rowKey='id'
                loading={this.state.isLoading}
                onChange={(page, pageSize) => this.fetchTransactionList(page.current)}
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }} 
                scroll={{ x: "3020px" }}
            />
        )
    }

    render () {
        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', background: '#FFFFFF' }}>
                {this.renderSearchBar()}
                {this.renderTable()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId
});

export default connect(mapStateToProps, {})(Transaction);

const Styles = {
    formItem: { width: 180 },
    actionFormItem: { width: 260 },
    label: { fontSize: 14, color: Colors.C1 },
};

