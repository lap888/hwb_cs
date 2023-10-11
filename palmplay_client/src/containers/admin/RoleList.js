/*
 * @Author: fantao.meng 
 * @Date: 2019-04-02 16:30:16 
 * @Last Modified by: top
 * @Last Modified time: 2019-04-10 17:08:45
 * @Last Modified by: top
 * @Last Modified time: 2019-05-15 20:13:03
 */

import { Form, Icon, Input, Button, Select, Table, Divider, Tag, Modal } from 'antd';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { CLIENT_STATUS, CLIENT_ACTION } from 'constantclient';
import { Colors } from 'theme';
import { Send } from 'HttpPost';
const Option = Select.Option;
const { TextArea } = Input;

class RoleList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            roleList: [],
            currentPage: 1,
            totalNumber: 1,
        }
    }

    componentDidMount() {
        this.fetchRoleList(1);
    }

    /**
     * 获取角色列表
     */
    fetchRoleList (page) {
        
        let { mobile, nickname, userId, status } = this.state;
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('Admin.getRoleList', { page, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                that.setState({ currentPage: page, roleList: list, totalNumber });
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
                    onClick={() => this.props.router.push({ pathname: `/admincreate` })}> 
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
            title: "角色",
            dataIndex: 'roleName',
            key: 'roleName',
            width: "25%"
        },{
            title: "角色ID",
            dataIndex: 'roleId',
            key: 'roleId',
            width: "25%"
        },{
            title: "创建时间",
            dataIndex: 'createTime',
            key: 'createTime',
            width: "25%",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`${moment(record['createTime']).format('YYYY年MM月DD日 HH时mm分')}`}</p>
            )
        },{
            title: '操作',
            key: 'action',
            width: "25%",
            render: (text, record) => (
              <span>
                <a onClick={() => this.props.router.push({ pathname: `/adminrightoperation/${record['roleId']}/${record['roleName']}` })}>权限</a>
                <Divider type="vertical" />
                <a onClick={() => this.props.router.push({ pathname: `/adminrightoperation/${record['roleId']}/${record['roleName']}` })}>操作</a>
              </span>
            ),
        }];
        return (
            <Table 
                columns={columns}
                loading={this.state.isLoading}
                dataSource={this.state.roleList}
                rowKey='roleId'
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }} 
                onChange={(page, pageSize) => this.fetchRoleList(page.current)}
            />
        )
    }

    render () {
        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', background: '#FFFFFF' }}>
                {/* {this.renderAddAdmin()} */}
                {this.renderAdminList()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId
});

export default connect(mapStateToProps, {})(RoleList);

const Styles = {
    formItem: { width: 180 },
    actionFormItem: { width: 260 },
    label: { fontSize: 14, color: Colors.C1 },
};
