/*
 * @Author: fantao.meng 
 * @Date: 2019-04-08 11:28:48 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-04-09 10:43:10
 */

import { Card, Checkbox, Form, Input, Button, Spin } from 'antd';
import { connect } from 'react-redux';
import { Send } from 'HttpPost';
import { Colors } from 'theme';

class AdminRightOperation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isOperating: false,

            rightList: [],
            roleRightList: [],
            roleRightListTemp: [],

            roleRightAddArray: [],
            roleRightDeleteArray: []
        }
    }

    componentDidMount () {
        let roleId = this.props.params.roleId;
        this.fetchRightList();
        this.fetchRoleRights(roleId);
    }

    /**
     * 获取权限列表
     */
    fetchRightList () {
        var that = this;
        Send('Admin.getRightList', { _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list } = response['data'];
                that.setState({ rightList: list });
            }
        });
    }

    /**
     * 获取角色权限
     */
    fetchRoleRights (roleId) {
        var that = this;
        Send('Admin.getRoleRightList', { roleId, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list } = response['data'];
                that.setState({ roleRightList: list, roleRightListTemp: list });
            }
        });
    }

    /**
     * 提交权限编辑
     */
    handleSubmit () {
        var that = this;
        let roleId = this.props.params.roleId;
        if (!that.state.isOperating) that.setState({ isOperating: true });
        if (that.state.isOperating) return;
        Send('Admin.operateRoleRight', { roleRightAdd: JSON.stringify(this.state.roleRightAddArray), roleRightDelete: JSON.stringify(this.state.roleRightDeleteArray), roleId, _uid: this.props.userId }, response => {
            if (that.state.isOperating) that.setState({ isOperating: false });
            if (response['success']) {
                let { list } = response['data'];
                that.setState({ roleRightList: list, roleRightListTemp: list, roleRightAddArray: [], roleRightDeleteArray: [] });
            }
        });
    }

    /**
     * 收集角色权限变化
     */
    collectChangeRoleRight(key, value) {
        let roleId = this.props.params.roleId;
        
        let { roleRightAddArray, roleRightDeleteArray, roleRightListTemp } = this.state;
        let roleRightAddArrayIndex = roleRightAddArray.findIndex(item => item['rightId'] === key);
        let roleRightDeleteArrayIndex = roleRightDeleteArray.findIndex(item => item['rightId'] === key);
        let roleRightListTempIndex = roleRightListTemp.findIndex(item => item['rightId'] === key);
        if (value) {
            if (roleRightListTempIndex === -1 && roleRightAddArrayIndex === -1) roleRightAddArray.push({ roleId, rightId: key })
            if (roleRightDeleteArrayIndex !== -1) roleRightDeleteArray.splice(roleRightDeleteArrayIndex, 1);
        } else {
            if (roleRightListTempIndex !== -1 && roleRightDeleteArrayIndex === -1) roleRightDeleteArray.push({ roleId, rightId: key });
            if (roleRightAddArrayIndex !== -1) roleRightAddArray.splice(roleRightAddArrayIndex, 1);
        }

        this.setState({ roleRightAddArray, roleRightDeleteArray, roleRightListTemp });
    }
    

    /**
     * 权限编辑
     */
    handleRightChange (key, value) {
        this.collectChangeRoleRight(key, value);
        let roleId = this.props.params.roleId;
        let roleRightListTemp = [...this.state.roleRightList];
        let rightIndex = roleRightListTemp.findIndex(item => item['rightId'] === key);
        if (value) {
            if (rightIndex === -1) roleRightListTemp.push({ roleId, rightId: key });
        } else {
            if (rightIndex !== -1) roleRightListTemp.splice(rightIndex, 1);
        }
        this.setState({ roleRightList: roleRightListTemp });
    }


     /**
     * 渲染保存权限
     */
    renderSaveRoleRight () {
        return (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    style={{ marginRight: 15 }}
                    type="primary" 
                    htmlType="submit"
                    onClick={() => this.handleSubmit()}> 
                    保存
                </Button>
            </div>
        )
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
        let { isLoading, isOperating, rightList, roleRightList } = this.state;
        return (
            <Spin style={{ height: '100%' }} spinning={isLoading || isOperating}>
                <Card style={{ backgroundColor: Colors.C8 }}>
                    {this.renderSaveRoleRight()}
                    <Form>
                        <Form.Item
                            label="角色"
                            {...formItemLayout}
                        >
                            <Input
                                disabled
                                placeholder="角色名称"
                                style={{ width: 200 }}
                                value={this.props.params.roleName}
                            />
                        </Form.Item>
                        <Form.Item
                            label="权限列表"
                            {...formItemLayout}
                        >
                        {rightList.map(item => {
                            let checked = roleRightList.some(element => element['rightId'] === item['rightId'] );
                            return (
                                <div style={{ display: 'flex', flexDirection: 'row' }} key={item['rightId']}>
                                    <Checkbox checked={checked} onChange={e => this.handleRightChange(item['rightId'], e.target.checked)} />
                                    <p style={{ margin: 0, marginLeft: 10 }}>{item['rightName']}</p>
                                </div>
                            )
                        })}
                        </Form.Item>
                    </Form>
                </Card>
            </Spin>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId,
})

export default connect(null, {})(AdminRightOperation);
