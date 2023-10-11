/*
 * @Author: fantao.meng 
 * @Date: 2019-04-08 23:40:04 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-05 14:47:30
 */

import { Colors } from 'theme';
import Config from 'config';
import { connect } from 'react-redux';
import { Router } from 'react-router';
import { Form, Icon, Input, Button, Select, Table, Divider, Tag, Modal, message } from 'antd';
import { Send } from 'HttpPost';
const { TextArea } = Input;

class AuthenticationDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mark: ''
        }
    }
    componentDidMount() {
        //console.log('认证详情页' + this.props.location.query.data);
    }
    /**
     * 审核通过
     */
    agreeFunc = (id,uid) => {
        Send('User.agreeAuthenticationInfo_2', { id: id,uId:uid, _uid: this.props.userId }, result => {
            if (result['success']) {
                this.props.router.push('/authentication');
                message.success("操作成功");
            } else {
                message.error("操作失败");
            }
        });
    }
    /**
     * 审核不通过
     */
    notAgreeFunc = (id) => {
        if (this.state.mark == '') {
            alert('驳回必须说明理由');
        } else {
            Send('User.notAgreeAuthenticationInfo', { id: id, mark: this.state.mark, _uid: this.props.userId }, result => {
                if (result['success']) {
                    this.props.router.push('/authentication');
                    message.success("操作成功");
                } else {
                    message.error("操作失败");
                }
            });
            //alert('驳回内容为:' + this.state.mark);
        }
    }
    render() {
        let { data } = this.props.location.state;        
        data = JSON.parse(data);
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
            <div>
                <h3 style={{ color: 'green' }}>认证详情页</h3>
                <div>
                    <p>当前状态:</p>
                    <p style={data.audit_state == 1 ? { color: 'pink' } : data.audit_state == 2 ? { color: 'green' } : data.audit_state == 3 ? { color: 'red' } : { color: 'black' }}>
                        {data.audit_state == 0 ? '审核中' : data.audit_state == 1 ? '初步审核通过' : data.audit_state == 2 ? '审核通过' : '审核未通过'}
                    </p>
                    <p>id:</p><p>{data.id}</p>
                    <p>真实姓名:</p><p>{data.true_name}</p>
                    <p>身份证号:</p><p>{data.id_num}</p>
                    <p>支付宝号:</p><p>{data.alipay}</p>
                    <p>手机号:</p><p>{data.mobile}</p>
                    <p>手持身份证:</p><img style={{ width: 500, height: 300 }} src={Config.RES_PATH + data.pic}></img>
                    <Divider />
                    <p>生身份证(正):</p><img style={{ width: 500, height: 300 }} src={Config.RES_PATH + data.pic1}></img>
                    <Divider />
                    <p>生身份证(反):</p><img style={{ width: 500, height: 300 }} src={Config.RES_PATH + data.pic2}></img>
                    <Divider />
                    <p>创建时间:</p><p>{moment(data.created_at).format('YYYY-MM-DD HH:mm')}</p>
                    <p>更新时间:</p><p>{moment(data.updated_at).format('YYYY-MM-DD HH:mm')}</p>
                    <Divider />
                    <Form.Item
                        style={{ ...Styles.actionFormItem, width: 400 }}
                        label={<p style={Styles.label}>说明/备注/原因</p>}
                        {...textareaItemLayout}>
                        <TextArea placeholder={data.fail_reason==''?"驳回必须备注驳回理由":data.fail_reason} rows={6} value={this.state.mark} onChange={event => this.setState({ mark: event.target.value }, () => {
                            //console.log('textArea 数据发生变化' + this.state.mark);
                        })} />
                    </Form.Item>
                    <Button key="back" disabled={data.audit_state == 2 ? true : null} onClick={() => this.notAgreeFunc(data.id)}>驳回</Button>
                    <Divider />
                    <Button key="back2" disabled={data.audit_state == 2 ? true : null} type="primary" onClick={() => this.agreeFunc(data.id,data.uId)}>通过</Button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId,
});

export default connect(mapStateToProps, {})(AuthenticationDetails);

const Styles = {
    formItem: { width: 180 },
    actionFormItem: { width: 300 },
    label: { fontSize: 14, color: Colors.C1 },
};
