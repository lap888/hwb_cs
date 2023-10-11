/*
 * @Author: fantao.meng 
 * @Date: 2019-02-20 14:18:52 
 * @Last Modified by: top.brids
 * @Last Modified time: 2019-10-17 20:57:28
 */

import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import { connect } from 'react-redux';
import { Router } from 'react-router';
import { LOGIN_SUCCESS, LOGOUT, UPSET_VSCODE_COUNT, UPSET_VSCODE_IMGID } from 'ActionTypes';
import { Send } from 'HttpPost';
import { Colors } from 'theme';
const FormItem = Form.Item;

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            vsCode: "",
        };
    }

    componentDidMount() {
        // 清除用户信息
        this.props.logout();
        // 验证码定时器
        if (this.props.count !== 0) this.checkInterval();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isLogged && !this.props.isLogged) {
            message.success('登录成功');
            this.props.router.push({ pathname: `/` })
        }
    }

    componentWillUnmount() {
        if (this.sendVsCodeInterval) clearInterval(this.sendVsCodeInterval);
    }

    /**
     * 提交登录
     */
    handleSubmit() {
        let { username, password, vsCode } = this.state;
        if (username == '') {
            message.warn('用户名不能为空');
            return;
        }
        if (password == '') {
            message.warn('密码不能为空');
            return;
        }
        // if (vsCode == '') {
        //     message.warn('验证码不能为空');
        //     return;
        // }
        var that = this;
        Send('Auth.login', { username, password: CryptoJS.MD5(password).toString(CryptoJS.enc.Hex), imgId: this.props.imgId, _uid: -1 }, response => {
            if (response['success']) {
                that.props.updateUserInfo(response['data']['userInfo']);
            } else {
                message.error(response['errorMsg']);
            }
        });
    };

    /**
     * 获取手机验证码
     */
    sendVsCode() {
        let { username, password } = this.state;
        if (username == '') {
            message.warn('用户名不能为空');
            return;
        }
        var that = this;
        // 定时器
        this.checkInterval();
        Send('Auth.sendVcode', { mobile: username, _uid: -1 }, response => {
            if (response['success']) {
                message.success("验证码发送成功");
                that.props.upsetVsCodeImgId(response['data']['msg_id']);
            } else {
                message.error(response['errorMsg']);
            }
        });
    }

    /**
     * 验证码定时器
     */
    checkInterval() {
        var that = this;
        // 定时器
        this.sendVsCodeInterval = setInterval(() => {
            if (that.props.count === 1 && that.sendVsCodeInterval) {
                that.props.upsetVsCodeCount(0);
                clearInterval(that.sendVsCodeInterval);
            } else if (that.props.count === 0) {
                that.props.upsetVsCodeCount(60);
            } else {
                let count = that.props.count;
                that.props.upsetVsCodeCount(--count);
            }
        }, 1000)
    }

    render() {
        return (
            <div style={Styles.container}>
                <div style={{ margin: 80 }}>
                    <p style={{ fontSize: 45, color: Colors.C8 }}>{`掌玩科技，不忘初心`}</p>
                </div>
                <div style={{ marginRight: 100, display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Form onSubmit={() => this.handleSubmit()} style={{ width: "400px", padding: '60px 80px 40px 80px', borderRadius: 4, background: '#00000055' }}>
                        <FormItem>
                            <Input autoComplete="new-password" onChange={(e) => this.setState({ username: e.target.value })} value={this.state.username}
                                prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                                placeholder="用户名"
                            />
                        </FormItem>
                        {/* <FormItem>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Input style={{ width: "120px" }} autoComplete="new-password" value={this.state.vsCode} onChange={(event) => this.setState({ vsCode: event.target.value })} 
                                    prefix={<Icon type="safety-certificate" style={{ fontSize: 12 }} />} 
                                    placeholder="验证码"
                                />
                                <Button disabled={this.props.count !== 0} style={{ width: 100 }} onClick={() => this.sendVsCode()}>{`${this.props.count === 0 ? "获取验证码" : ("发送" + this.props.count + "秒")}`}</Button>
                            </div>
                        </FormItem> */}
                        <FormItem>
                            <Input autoComplete="new-password" value={this.state.password} onChange={(event) => this.setState({ password: event.target.value })}
                                prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                                type="password" placeholder="密码"
                                onPressEnter={() => this.handleSubmit()}
                            />
                        </FormItem>
                        <FormItem>
                            <Button type="primary" onClick={() => this.handleSubmit()} htmlType="button" style={{ width: '100%' }}>
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

const Styles = {
    container: { backgroundSize: '100%', display: 'flex', flex: 1, height: 800, background: `url(${require("images/auth/background.jpg")}) center center / cover no-repeat` }
}

const mapStateToProps = state => ({
    userId: state.user.userId,
    isLogged: state.user.isLogged,
    count: state.auth.count,
    imgId: state.auth.imgId
});

const mapDispatchToProps = dispatch => ({
    updateUserInfo: userInfo => dispatch({ type: LOGIN_SUCCESS, payload: { userInfo } }),
    logout: () => dispatch({ type: LOGOUT }),
    upsetVsCodeCount: count => dispatch({ type: UPSET_VSCODE_COUNT, payload: { count } }),
    upsetVsCodeImgId: imgId => dispatch({ type: UPSET_VSCODE_IMGID, payload: { imgId } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);


