/*
 * @Author: fantao.meng 
 * @Date: 2019-02-24 23:22:41 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-03 17:03:36
 */

import { Table, Divider, Form, Input, Icon, Select, Button } from 'antd';
import { connect } from 'react-redux';
import { Send } from 'HttpPost';
import { Colors } from 'theme';
import { APPEAL_STATUS } from 'constanttrade';

class AppealList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            currentPage: 1,
            totalNumber: 1,
            appealList: [],

            buyerAlipay: "",
            sellerAlipay: "",
            status: 3,
        }
    }

    componentDidMount () {
        this.fetchAppealList(1);
    }

    /**
     * 获取申诉列表
     */
    fetchAppealList (page) {
        var that = this;
        if (!this.state.isLoading) this.setState({ isLoading: true });

        let { buyerAlipay, sellerAlipay, status } = this.state;
        if (status === 3) status = "";
        Send('Trade.appealList', { buyerAlipay, sellerAlipay, status, page, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                that.setState({ currentPage: page, appealList: list, totalNumber });
            }
        });
    }

    /**
     * 获取申诉状态
     */
    getAppealStatus(record) {
        let { status, appealResult } = record;
        if (status === 0) return "待处理";
        if (appealResult === 0) return "驳回";
        if (appealResult === 1) return "同意";
        // 兼容垃圾数据
        return "";
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
                            {APPEAL_STATUS.map(item => <Select.Option key={item['key']} value={item['key']}>{item['value']}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary" 
                            htmlType="submit"
                            onClick={() => this.fetchAppealList(1)}> 
                            Search
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }

    /**
     * 渲染申诉列表
     */
    renderTable () {
        const columns = [
            {
                title: '申诉描述',
                dataIndex: 'description',
                key: 'description',
            },{
                title: '申诉时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: '15%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${text ? moment(text).format('YYYY年MM月DD日 HH时mm分') : "--"}`}</p>
                )
            },{
                title: '处理时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                width: '15%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${(text && record['status'] === 1) ? moment(text).format('YYYY年MM月DD日 HH时mm分') : "--"}`}</p>
                )
            },,{
                title: '申诉状态',
                dataIndex: 'status',
                key: 'status',
                width: '15%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{this.getAppealStatus(record)}</p>
                )
            },{
                title: '操作',
                key: 'action',
                width: "15%",
                render: (text, record) => (
                  <span>
                    <a onClick={() => this.props.router.push({ pathname: `/appealinfo/${record['id']}` })}>详情</a>
                    <Divider type="vertical" />
                  </span>
                ),
            }
        ];
        return (
            <Table columns={columns} dataSource={this.state.appealList}
                rowKey='id'
                loading={this.state.isLoading}
                onChange={(page, pageSize) => this.fetchAppealList(page.current)}
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }} 
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

export default connect(mapStateToProps, {})(AppealList);

const Styles = {
    formItem: { width: 180 },
    actionFormItem: { width: 260 },
    label: { fontSize: 14, color: Colors.C1 },
};

