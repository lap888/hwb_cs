/*
 * @Author: fantao.meng 
 * @Date: 2019-02-19 23:13:13 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-04 01:00:06
 */

import { Form, Icon, Input, Button, Select, Table, Divider, Tag, Modal } from 'antd';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { CLIENT_STATUS, CLIENT_ACTION } from 'constantclient';
import { Colors } from 'theme';
import { Send } from 'HttpPost';
const Option = Select.Option;
const { TextArea } = Input;

class RiskTransaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            nickname: '',
            userId: '',
            status: '',

            isLoading: true,
            clientList: [],
            currentPage: 1,
            totalNumber: 1,

            actionLoading: false,       // 用户操作状态
            actionModalVisible: false,   // 用户操作弹出框
            actionType: "",             // 用户信息操作类型
            userId: "",
            realname: "",
            nickname: "",
            mobile: "",
            description: ""
        }
    }

    componentDidMount() {
        this.fetchClientList(1);
    }

    /**
     * 获取用户列表
     */
    fetchClientList (page) {
        let { mobile, nickname, userId, status } = this.state;
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('User.getUserList', { mobile, nickname, userId, status, page, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                that.setState({ currentPage: page, clientList: list, totalNumber });
            }
        });
    }

    /**
     * 用户信息操作类型 SelectChange
     * @param {*} value 
     */
    onActionTypeSelectChange (value) {
        this.setState({ actionType: value });
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
            }
        });
    }

    /**
     * 弹出、收起用户操作框
     * @param {*} flag 
     */
    confirmClientAction (flag) {
        if (!flag) {
            this.setState({ actionModalVisible: false }, () => {
                this.setState({ actionType: "", userId: "", realname: "", nickname: "", mobile: "", description: ""  });
            });
            return;
        }
        this.setState({ actionLoading: true }, () => {
            setTimeout(() => {
                this.setState({ actionLoading: false, actionModalVisible: false });
            }, 2600);
        });
    }

    /**
     * 打开用户信息弹出框
     */
    openClientActionModal (record) {
        let { userId, realname, nickname, mobile } = record;
        this.setState({ userId, realname, nickname, mobile }, () => {
            this.setState({ actionModalVisible: true });
        });
    }

    /**
     * 渲染搜索框
     */
    renderSearchBar () {
        let { mobile, nickname, userId, status } = this.state;
        return (
            <div style={{ display: 'flex', margin: '20px', borderWidth: 1, borderRadius: 4, borderColor: 'rgba(0, 0, 0, 0.15)', borderStyle: 'solid' }}>
                <Form style={{ padding: '26px 40px 26px 40px' }} layout="inline">
                    <Form.Item style={Styles.formItem}>
                        <Input
                            autoComplete="new-password"
                            prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                            placeholder="请输入用户手机号" 
                            value={mobile} 
                            onChange={e => this.setState({ mobile: e.target.value })} 
                        />
                    </Form.Item>
                    <Form.Item style={Styles.formItem}>
                        <Input 
                            autoComplete="new-password"
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                            placeholder="请输入用户昵称"
                            value={nickname} 
                            onChange={e => this.setState({ nickname: e.target.value })} 
                        />
                    </Form.Item>
                    <Form.Item style={Styles.formItem}>
                        <Input
                            autoComplete="new-password"
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                            placeholder="请输入用户ID"
                            value={userId} 
                            onChange={e => this.setState({ userId: e.target.value })} 
                        />
                    </Form.Item>
                    <Form.Item style={Styles.formItem}>
                        <Select defaultValue={status} style={Styles.formItem} onChange={status => this.setState({ status })}>
                            {CLIENT_STATUS.map(item => <Option key={item['key']} value={item['key']}>{item['value']}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary" 
                            htmlType="submit"
                            onClick={() => this.fetchClientList(1)}> 
                            Search
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }

    /**
     * 渲染用户列表
     */
    renderClientList () {
        const columns = [{
            title: "用户名",
            dataIndex: 'mobile',
            key: 'mobile',
            width: "150px",
            fixed: 'left'
        },{
            title: "用户ID",
            dataIndex: 'userId',
            key: 'userId',
            width: "150px"
        },{
            title: "昵称",
            dataIndex: 'nickname',
            key: 'nickname',
            width: "150px"
        },{
            title: "支付宝",
            dataIndex: 'alipay',
            key: 'alipay',
            width: "150px"
        },{
            title: "会员等级",
            dataIndex: 'level',
            key: 'level',
            width: "150px",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`${record['level'].toUpperCase()}`}</p>
            )
        },{
            title: "贡献值",
            dataIndex: 'goldFlows',
            key: 'goldFlows',
            width: "150px"
        },{
            title: "荣誉值",
            dataIndex: 'creditScore',
            key: 'creditScore',
            width: "150px"
        },{
            title: "邀请人",
            dataIndex: 'inviterMobile',
            key: 'inviterMobile',
            width: "150px"
        },{
            title: "钻石余额",
            dataIndex: 'gem',
            key: 'gem',
            width: "150px",
        },{
            title: "冻结钻石",
            dataIndex: 'freezeGem',
            key: 'freezeGem',
            width: "150px",
        },{
            title: "分红余额",
            dataIndex: 'userBalance',
            key: 'userBalance',
            width: "150px",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`¥${text}`}</p>
            )
        },{
            title: "分红可提现",
            dataIndex: 'balanceNormal',
            key: 'balanceNormal',
            width: "150px",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`¥${text}`}</p>
            )
        },{
            title: "分红冻结",
            dataIndex: 'balanceLock',
            key: 'balanceLock',
            width: "150px",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`¥${text}`}</p>
            )
        },{
            title: "注册时间",
            dataIndex: 'createTime',
            key: 'createTime',
            width: "150px",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`${moment(record['createTime']).format('YYYY年MM月DD日 HH时mm分')}`}</p>
            )
        },
        {
            title: "状态",
            dataIndex: 'status',
            key: 'status',
            width: "150px",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`${CLIENT_STATUS[record['status'] + 1]['value']}`}</p>
            )
        },{
            title: '操作',
            key: 'action',
            width: "150px",
            fixed: 'right',
            render: (text, record) => (
              <span>
                <a onClick={() => this.props.router.push({ pathname: `/clientinfo/${record['userId']}` })}>详情</a>
                <Divider type="vertical" />
                <a onClick={() => this.openClientActionModal(record)}>操作</a>
              </span>
            ),
        }];
        const data = [
            {
                alipay: '',
                creditScore: "lv3",
                gem: 27706.61290855,
                freezeGem: 87.1,
                goldFlows: "lv3",
                inviterMobile: 0,
                level: "lv3",
                mobile: "1260000000",
                nickname: "xxx",
                realname: "xxx",
                status: 1,
                userBalance: "lv3",
                userId: 1,
                balanceNormal: 0,
                balanceLock: 0
            }
        ];
        return (
            <Table 
                columns={columns}
                loading={this.state.isLoading}
                dataSource={this.state.clientList} 
                rowKey='userId'
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }} 
                scroll={{ x: "2400px" }} 
                onChange={(page, pageSize) => this.fetchClientList(page.current)}
            />
        )
    }

    /**
     * 渲染用户操作Modal
     */
    renderClientActionModal() {
        let { actionLoading, actionModalVisible, userId, realname, nickname, mobile, description } = this.state;

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
        const textareaItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        return (
            <Modal
                visible={actionModalVisible}
                title="用户信息操作框"
                onOk={() => this.confirmClientAction(true)}
                onCancel={() => this.confirmClientAction(false)}
                footer={[
                    <Button key="back" onClick={() => this.confirmClientAction(false)}>再想想...</Button>,
                    <Button key="submit" type="primary" loading={actionLoading} onClick={() => this.confirmClientAction(true)}>确定</Button>,
                ]}>
                <div style={{ display: 'flex', flex: 1 }}>
                    <Form style={{ padding: '10px 10px 10px 10px' }} layout="vertical">
                        <Form.Item
                            style={Styles.actionFormItem}
                            label={<p style={Styles.label}>姓名</p>}
                            {...formItemLayout}>
                            <Input disabled prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} value={realname} />
                        </Form.Item>
                        <Form.Item
                            style={Styles.actionFormItem}
                            label={<p style={Styles.label}>昵称</p>}
                            {...formItemLayout}>
                            <Input disabled prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} value={nickname} />
                        </Form.Item>
                        <Form.Item
                            style={Styles.actionFormItem}
                            label={<p style={Styles.label}>联系方式</p>}
                            {...formItemLayout}>
                            <Input disabled prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} value={mobile} />
                        </Form.Item>
                        <Form.Item
                            style={Styles.actionFormItem}
                            label={<p style={Styles.label}>操作类型</p>}
                            {...formItemLayout}>
                                <Select onChange={value => this.onActionTypeSelectChange(value)}>
                                    {CLIENT_ACTION.map(item => <Option key={item['key']} value={item['key']}>{item['value']}</Option>)}
                                </Select>
                        </Form.Item>
                        <Form.Item
                            style={{ ...Styles.actionFormItem, width: 400 }}
                            label={<p style={Styles.label}>操作日志</p>}
                            {...textareaItemLayout}>
                            <TextArea placeholder="请您简述操作描述信息，以便存档" rows={4} onChange={event => this.setState({ description: event.nativeEvent.data })} />
                        </Form.Item>
                        <Form.Item
                            style={Styles.actionFormItem}
                            label={<p style={Styles.label}>操作人员</p>}
                            {...formItemLayout}>
                            <Input disabled prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} value={"杨幂"} />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        )
    }

    render () {
        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', background: '#FFFFFF' }}>
                <p>暂缓开通</p>
                {/* 搜索框 */}
                {/* {this.renderSearchBar()} */}
                {/* 用户列表 */}
                {/* {this.renderClientList()} */}
                {/* 用户操作框 */}
                {/* {this.renderClientActionModal()} */}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId
});

export default connect(mapStateToProps, {})(RiskTransaction);

const Styles = {
    formItem: { width: 180 },
    actionFormItem: { width: 260 },
    label: { fontSize: 14, color: Colors.C1 },
};
