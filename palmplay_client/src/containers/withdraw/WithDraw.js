import React, { Component } from 'react'
import { Form, Icon, Input, Button, Select, Table, Divider, Tag, Modal, message } from 'antd';
import { connect } from 'react-redux';
import { WithDrawStatus } from 'constantclient';
import { Link } from 'react-router';
import { Colors } from 'theme';
import { Send } from 'HttpPost';
const Option = Select.Option;

class WithDraw extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            actionModalVisible: false,
            mobile: '',
            userId: -1,
            state: '',//提现审核状态
            content: '',
            addOrUpdate: -1,//1 驳回 2 同意 3 编辑
            alipayId: '',//支付宝订单号
            hId: -1,
            amounts: 0,
            pageIndex: 1,//页索引/当前页
            pageSize: 10,//页大小
            total: 8//总条数
        }
    }

    componentDidMount() {
        this.initData();
    }

    //加载数据
    initData = () => {
        Send('WithDraw.userWithDrawInfo', { mobile: '',state:'',_uid: this.props.userId }, result => {
            if (result.data.length > 0) {
                this.setState({
                    data: result.data,
                    total: result.total
                });
            }
        });
    }

    //search load data
    searchLoadData = (mobile) => {
        Send('WithDraw.userWithDrawInfo', { mobile: mobile, state: this.state.state, _uid: this.props.userId }, result => {
            this.setState({
                data: result.data,
                total: result.total
            });

        });
    }

    //search load data
    searchLoadDataByPage = (mobile, pageIndex, pageSize) => {
        Send('WithDraw.userWithDrawInfo', { uid: -1, mobile: mobile, pageIndex: pageIndex, pageSize: pageSize, state: this.state.state }, result => {
            this.setState({
                data: result.data,
                total: result.total
            });

        });
    }
    /**
     * 同意打款
     */
    agreeData = (record) => {
        //let data = { uId: this.state.userId, content: this.state.content, hId: this.state.hId, alipayId: this.state.alipayId }
        let uid = record.uId;
        let hid = record.hId;
        //let amount = record.amount;
        let alipayId = record.alipayId;
        Send('WithDraw.agreeWithDraw', { uId: uid, hId: hid, amounts: this.state.amounts, alipayId: alipayId, _uid: this.props.userId }, result => {
            if (result['success']) {
                message.success("操作成功");
                this.initData();
            } else {
                message.error('操作失败:' + result.errMsg)
            }
        });
    }
    //select value
    onSelectChange = (value) => {
        this.setState({
            state: value
        });
    }
    /**
     * 编辑订单
     */
    updateWithDrawHistory = (record) => {
        let uid = record.uId;
        let hid = record.hId;
        //let amount = record.amount;
        let alipayId = record.alipayId;
        Send('WithDraw.updateWithDrawHistory', { uId: uid, hId: hid, amounts: this.state.amounts, alipayId: alipayId, _uid: this.props.userId }, result => {
            if (result['success']) {
                message.success("操作成功");
                this.initData();
            } else {
                message.error('操作失败:' + result.errMsg)
            }
        });
    }

    /**
     * 渲染搜索框
     */
    renderSearchBar() {
        return (
            <div style={{ display: 'flex', margin: '20px', borderWidth: 1, borderRadius: 4, borderColor: 'rgba(0, 0, 0, 0.15)', borderStyle: 'solid' }}>
                <Form style={{ padding: '30px 40px 30px 40px' }} layout="inline">
                    <Form.Item style={Styles.formItem}>
                        <Input autoComplete="new-password" value={this.state.mobile} onChange={event => this.setState({ mobile: event.target.value })} prefix={<Icon type="game" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户手机号" />
                    </Form.Item>
                    <Form.Item style={Styles.formItem}>
                        <Select defaultValue="" style={Styles.formItem} onChange={value => this.onSelectChange(value)}>
                            {WithDrawStatus.map(item => <Option key={item['key']} value={item['key']}>{item['value']}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={() => this.searchLoadData(this.state.mobile)} htmlType="button"> 搜索</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }

    /**
     * 弹出、收起用户操作框
     * @param {驳回 1,同意 2,编辑 3} addOrUpdate
     * @param {*} flag 暂无意义
     */
    confirmClientAction(flag) {
        let data = { uId: this.state.userId, content: this.state.content, hId: this.state.hId, alipayId: this.state.alipayId, _uid: this.props.userId }
        if (this.state.addOrUpdate == 1) {
            if (!flag) {
                this.setState({ actionModalVisible: false }, () => {
                    this.setState({ content: '' });
                });
                return;
            } else {
                if (typeof (data.content) == 'undefined' || data.content == '') {
                    this.setState({ actionLoading: false, actionModalVisible: false });
                    message.warn('驳回原因必须说明');
                    return;
                }
                Send('WithDraw.notAgreeWithDrawInfo', data, (result) => {
                    if (result['success']) {
                        this.setState({ actionLoading: false, actionModalVisible: false });
                        this.initData();
                    } else {
                        message.error("操作失败");
                    }
                });
            }

        } else if (this.state.addOrUpdate == 2) {
            //同意
            if (!flag) {
                this.setState({ actionModalVisible: false }, () => {
                    this.setState({ content: '' });
                });
                return;
            } else {
                if (typeof (data.alipayId) == 'undefined' || data.alipayId == '') {
                    this.setState({ actionLoading: false, actionModalVisible: false });
                    message.warn('同意请填写支付宝打款订单号!');
                    return;
                }
                this.agreeData(data);
                this.setState({ actionLoading: false, actionModalVisible: false });
            }
        } else if (this.state.addOrUpdate == 3) {
            //修改
            if (!flag) {
                this.setState({ actionModalVisible: false }, () => {
                    this.setState({ content: '' });
                });
                return;
            } else {
                if (typeof (data.alipayId) == 'undefined' || data.alipayId == '') {
                    this.setState({ actionLoading: false, actionModalVisible: false });
                    message.warn('请填写支付宝打款订单号!');
                    return;
                }
                this.updateWithDrawHistory(data);
                this.setState({ actionLoading: false, actionModalVisible: false });
            }
        } else {
            message.error('系统错误');
        }
    }

    /**
     * 打开用户信息弹出框
     */
    openClientActionModal(record) {
        //赋值变化
        let amount = record.amount;
        let user_id = record.user_id;
        let content = record.contect;
        this.setState({ userId: user_id, content: content, hId: record.id, alipayId: record.order_code, amounts: amount }, () => {
            this.setState({ actionModalVisible: true });
        });
    }

    /**
     * 渲染用户操作Modal
     */
    renderClientActionModal() {
        let { actionLoading, actionModalVisible, name } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        let orderNumCom = (
            <Form.Item
                style={Styles.actionFormItem}
                label={<p style={Styles.label}>打款订单号</p>}
                {...formItemLayout}>
                <Input autoComplete="new-password" defaultValue={this.state.alipayId} value={this.state.alipayId} prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={event => {
                    this.setState({ alipayId: event.target.value }, () => {
                    })
                }} />
            </Form.Item>
        );
        return (
            <Modal
                visible={actionModalVisible}
                title={this.state.addOrUpdate == 1 ? '驳回提示框' : this.state.addOrUpdate == 2 ? '同意提示框' : '编辑提示框'}
                onOk={() => this.confirmClientAction(true)}
                onCancel={() => this.confirmClientAction(false)}
                footer={[
                    <Button key="back" onClick={() => this.confirmClientAction(false)}>取消</Button>,
                    <Button key="submit" type="primary" loading={actionLoading} onClick={() => this.confirmClientAction(true)}>确定</Button>,
                ]}>
                <div style={{ display: 'flex', flex: 1 }}>
                    <Form style={{ padding: '10px 10px 10px 10px' }} layout="vertical">
                        {this.state.addOrUpdate != 1 ? orderNumCom : null}
                        {this.state.addOrUpdate == 1 ? <Form.Item
                            style={Styles.actionFormItem}
                            label={<p style={Styles.label}>备注</p>}
                            {...formItemLayout}>
                            <Input autoComplete="new-password" defaultValue={this.state.content} value={this.state.content} prefix={<Icon type="fire" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={event => {
                                this.setState({ content: event.target.value }, () => {
                                })
                            }} />
                        </Form.Item> : null}
                    </Form>
                </div>
            </Modal>
        )
    }

    /**
     * 渲染认证信息列表
     */
    renderMainList() {
        const columns = [
            {
                title: "编号",
                dataIndex: 'id',
                key: 'id',
                width: "150px"
            },{
                title: "昵称",
                dataIndex: 'name',
                key: 'name',
                width: "150px",
                render: (text, record) => (
                    <a onClick={() => this.props.router.push({ pathname: `/clientinfo/${record['user_id']}` })}>{text}</a>
                ),
            },{
                title: "姓名",
                dataIndex: 'realName',
                key: 'realName',
                width: "150px",
            },{
                title: "手机号",
                dataIndex: 'mobile',
                key: 'mobile',
                width: "150px",
            },
            {
                title: "提现支付宝",
                dataIndex: 'withdraw_to',
                key: 'withdraw_to',
                width: "150px",
            },
            {
                title: "锁定金额",
                dataIndex: 'balance_lock',
                key: 'balance_lock',
                width: "150px",
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`¥${text}`}</p>
                )
            },
            {
                title: "提现金额",
                dataIndex: 'amount',
                key: 'amount',
                width: "150px",
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`¥${record['amount']}`}</p>
                )
            },
            {
                title: "转账金额",
                dataIndex: 'amount',
                key: 'amount1',
                width: "150px",
                render: (text, record) => (
                    <a style={{ margin: 0 }}>{`¥${Math.ceil(record['amount'] * 0.97)}`}</a>
                )
            },
            {
                title: "手续费3%",
                dataIndex: 'amount',
                key: 'amount2',
                width: "150px",
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`¥${record['amount'] - Math.ceil(record['amount'] * 0.97)}`}</p>
                )
            },
            // {
            //     title: "可提现金额",
            //     dataIndex: 'balance_normal',
            //     key: 'balance_normal',
            //     width: "150px",
            // },
            {
                title: "状态",
                dataIndex: 'status',
                key: 'status',
                width: "150px",
                render: (text, record) => (
                    <p style={record.status == 1 ? { color: 'pink', margin: 0 } : record.status == 2 ? { color: 'green', margin: 0 } : record.status == 3 ? { color: 'red', margin: 0 } : { color: 'black', margin: 0 }}>
                        {record.status == 0 ? '提现中' : record.status == 1 ? '提现成功' : record.status == 2 ? '提现失败' : '未知..'}
                    </p>
                )
            },{
                title: "申请时间",
                dataIndex: 'created_at',
                key: 'created_at',
                width: "220px",
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{moment(record['created_at']).format('YYYY年MM月DD日 HH时mm分')}</p>
                )
            },{
                title: "审核时间",
                dataIndex: 'updated_at',
                key: 'updated_at',
                width: "220px",
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{moment(record['updated_at']).format('YYYY年MM月DD日 HH时mm分')}</p>
                )
            },{
                title: '操作',
                key: 'action',
                width: "270px",
                fixed: 'right',
                render: (text, record) => (
                    <span>
                        <Button key="back" disabled={record.status == 1 || record.status == 2 ? true : null} onClick={() => {
                            this.setState({ addOrUpdate: 1 }, () => {
                                this.openClientActionModal(record)
                            })
                        }}>驳回</Button>
                        <Divider type="vertical" />
                        <Button key="back2" disabled={record.status == 1 || record.status == 2 ? true : null} onClick={() => {
                            this.setState({ addOrUpdate: 2 }, () => {
                                this.openClientActionModal(record)
                            })
                        }}>同意</Button>
                        <Divider type="vertical" />
                        <Button key="back3" onClick={() => {
                            this.setState({ addOrUpdate: 3 }, () => {
                                this.openClientActionModal(record)
                            })
                        }}>编辑</Button>
                    </span>
                ),
            }];
        return (
            <Table columns={columns} dataSource={this.state.data} rowKey="id" scroll={{ x: "2210px" }}  pagination={{
                position: 'bottom', current: this.state.pageIndex, total: this.state.total, pageSize: this.state.pageSize, onChange: (page, pageSize) => {
                    this.searchLoadDataByPage(this.state.mobile, page, pageSize);
                    this.setState({
                        pageIndex: page,
                        pageSize: pageSize
                    });
                }
            }} />
        )
    }
    render() {
        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', background: '#FFFFFF' }}>
                {/* 搜索框 */}
                {this.renderSearchBar()}
                {this.renderMainList()}
                {/* 操作框 */}
                {this.renderClientActionModal()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId,
});

export default connect(mapStateToProps, {})(WithDraw);


const Styles = {
    formItem: { width: 180 },
    actionFormItem: { width: 300 },
    label: { fontSize: 14, color: Colors.C1 },
};
