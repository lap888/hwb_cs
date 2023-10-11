/*
 * @Author: fantao.meng 
 * @Date: 2019-04-02 17:07:16 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-04-09 10:37:58
 */

import { Form, Input, Icon, Select, Button, message } from 'antd';
import { connect } from 'react-redux';
import { Send } from 'HttpPost';
import { Colors } from 'theme';
const { Option } = Select;

class AdminCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roleList: [],
            roleLoading: true,

            username: '',
            nickname: '',
            password: '',
            passwordTemp: '',
            role: '',

            submitLoading: false,
        }
    }

    componentDidMount () {
        this.fetchRoleList();
    }

    /**
     * 获取角色列表
     */
    fetchRoleList () {
        var that = this;
        Send('Admin.getRoleList', { page: -1, _uid: this.props.userId }, response => {
            if (that.state.roleLoading) that.setState({ roleLoading: false });
            if (response['success']) {
                let { list } = response['data'];
                that.setState({ roleList: list });
            }
        });
    }

    /**
     * 管理员角色选择
     */
    handleRoleChange (value) {
        this.setState({ role: value });
    }

    /**
     * 创建管理员
     */
    handleSubmit () {
        let { username, nickname, password, passwordTemp, role, submitLoading } = this.state;
        if (username.trim() === '') {
            message.warn('用户名为必填项');
            return;
        }
        if (nickname.trim() === '') {
            message.warn('昵称为必填项');
            return;
        }
        if (password.trim() === '') {
            message.warn('密码为必填项');
            return;
        }
        if (password !== passwordTemp) {
            message.warn('两次输入密码不一致');
            return;
        }
        if (role === '') {
            message.warn('用户角色为必填项');
            return;
        }
        
        var that = this;
        let passwordMD5 = CryptoJS.MD5(password).toString(CryptoJS.enc.Hex);
        if (!submitLoading) that.setState({ submitLoading: true });
        Send('Admin.createAdmin', { username, nickname, password: passwordMD5, role, _uid: this.props.userId }, response => {
            if (that.state.submitLoading) that.setState({ submitLoading: false });
            if (response['success']) {
                message.success("管理后台账户创建成功");
            } else {
                message.error(response['errorMsg']);
            }
        });
    }

    render () {
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
        let { username, nickname, password, passwordTemp, role, submitLoading } = this.state;
        return (
            <div style={{ padding: 40, height: '100%', background: Colors.C8 }}>
                <Form>
                    <Form.Item
                        label="用户名"
                        {...formItemLayout}
                    >
                        <Input
                            type="phone"
                            autoComplete="new-password"
                            style={{ width: 200 }}
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="请输入手机号"
                            value={username}
                            onChange={e => this.setState({ username: e.target.value })} 
                        />
                    </Form.Item>
                    <Form.Item
                        label="昵称"
                        {...formItemLayout}
                    >
                        <Input 
                            type="phone"
                            autoComplete="new-password"
                            style={{ width: 200 }}
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="请输入手机号"
                            value={nickname}
                            onChange={e => this.setState({ nickname: e.target.value })} 
                        />
                    </Form.Item>
                    <Form.Item
                        label="密码"
                        {...formItemLayout}
                    >
                        <Input 
                            type="password"
                            autoComplete="new-password"
                            style={{ width: 200 }}
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="请输入账户密码"
                            value={password}
                            onChange={e => this.setState({ password: e.target.value })} 
                        />
                    </Form.Item>
                    <Form.Item
                        label="确认密码"
                        {...formItemLayout}
                    >
                        <Input 
                            type="password"
                            autoComplete="new-password"
                            style={{ width: 200 }}
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="请再一次输入账户密码"
                            value={passwordTemp}
                            onChange={e => this.setState({ passwordTemp: e.target.value })} 
                        />
                    </Form.Item>
                    <Form.Item
                        label="角色"
                        {...formItemLayout}
                    >
                        <Select defaultValue={this.state.role} 
                            style={{ width: 120 }}
                            loading={this.state.roleLoading}
                            onChange={this.handleRoleChange.bind(this)}>
                            {this.state.roleList.map(item => <Option key={item['roleId']} value={item['roleId']}>{item['roleName']}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8 }}>
                        <Button loading={submitLoading} type="primary" htmlType="submit"
                            onClick={this.handleSubmit.bind(this)}
                        >创建管理员</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId,
});

export default connect(mapStateToProps, {})(AdminCreate);