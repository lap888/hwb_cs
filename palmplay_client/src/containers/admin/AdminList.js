/*
 * @Author: fantao.meng 
 * @Date: 2019-04-02 16:30:16 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-13 10:33:40
 */

import { Form, Icon, Input, Button, Select, Table, Divider, Tag, Modal, message } from 'antd';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { CLIENT_STATUS, CLIENT_ACTION } from 'constantclient';
import { Colors } from 'theme';
import { Send } from 'HttpPost';
const Option = Select.Option;
const { TextArea } = Input;

class AdminList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            adminList: [],
            currentPage: 1,
            totalNumber: 1,
        }
    }

    componentDidMount() {
        this.fetchAdminList(1);
    }

    /**
     * 获取用户列表
     */
    fetchAdminList (page) {
        let { mobile, nickname, userId, status } = this.state;
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('Admin.getAdminList', { page, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                that.setState({ currentPage: page, adminList: list, totalNumber });
            }
        });
    }

    /**
     * 渲染添加管理员
     */
    renderAddAdmin () {
        return (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    style={{ margin: 20 }}
                    type="primary" 
                    htmlType="submit"
                    //onClick={() => this.props.router.push({ pathname: `/admincreate` })}> 
                    onClick={() => message.error("我正在看着你看着你目不转睛")}> 
                    创建管理员
                </Button>
            </div>
        )
    }

    /**
     * 渲染管理员列表
     */
    renderAdminList () {
        const columns = [{
            title: "用户名",
            dataIndex: 'username',
            key: 'username',
            width: "15%"
        },{
            title: "用户ID",
            dataIndex: 'userId',
            key: 'userId',
            width: "15%"
        },{
            title: "昵称",
            dataIndex: 'nickname',
            key: 'nickname',
            width: "15$%"
        },{
            title: "角色",
            dataIndex: 'roleName',
            key: 'roleName',
            width: "15%"
        },{
            title: "注册时间",
            dataIndex: 'createTime',
            key: 'createTime',
            width: "20%",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`${moment(record['createTime']).format('YYYY年MM月DD日 HH时mm分')}`}</p>
            )
        },{
            title: '操作',
            key: 'action',
            width: "20%",
            render: (text, record) => (
              <span>
                <a onClick={() => this.props.router.push({ pathname: `/clientinfo/${record['userId']}` })}>详情</a>
                <Divider type="vertical" />
                <a onClick={() => {}}>操作</a>
              </span>
            ),
        }];
        return (
            <Table 
                columns={columns}
                loading={this.state.isLoading}
                dataSource={this.state.adminList} 
                rowKey='userId'
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }} 
                onChange={(page, pageSize) => this.fetchAdminList(page.current)}
            />
        )
    }

    render () {
        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', background: '#FFFFFF' }}>
                {this.renderAddAdmin()}
                {this.renderAdminList()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId
});

export default connect(mapStateToProps, {})(AdminList);

const Styles = {
    formItem: { width: 180 },
    actionFormItem: { width: 260 },
    label: { fontSize: 14, color: Colors.C1 },
};
