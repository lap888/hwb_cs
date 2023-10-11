/*
 * @Author: fantao.meng 
 * @Date: 2019-04-08 23:39:33 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-08 15:18:39
 */

import { Form, Icon, Input, Button, Select, Table, Divider, Tag, Modal } from 'antd';
import { Authentication_Status } from 'constantclient';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Colors } from 'theme';
import { Send } from 'HttpPost';
const Option = Select.Option;

class AuthenticationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            mobile: '',
            state: -1,
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
        var that = this;
        Send('User.authenticationinfos', { _uid: this.props.userId }, result => {
            if (result.data.length > 0) {
                that.setState({ data: result.data, total: result.total });
            }
        });
    }
    //page load data
    pageLoadData = (pageIndex, pageSize) => {
        var that = this;
        Send('User.authenticationinfos', { _uid: this.props.userId, pageIndex, pageSize }, result => {
            if (result.data.length > 0) {
                that.setState({ data: result.data, total: result.total });
            }
        });
    }
    //search load data
    searchLoadData = (mobile,state) => {
        var that = this;
        Send('User.authenticationinfos', { _uid: this.props.userId, mobile:mobile, state:state}, result => {
            that.setState({ data: result.data, total: result.total });
        });
    }
    //search load data
    searchLoadDataByPage = (mobile,state,pageIndex,pageSize) => {
        var that = this;
        Send('User.authenticationinfos', { _uid: this.props.userId, mobile:mobile, state:state,pageIndex:pageIndex,pageSize:pageSize}, result => {
            that.setState({ data: result.data, total: result.total });
        });
    }
    //select value
    onSelectChange = (value) => {
        this.setState({
            state: value
        });
        //console.log(`selected ${value}`);
    }
    //click search
    searchClick=()=>{
        //.log('mobil',this.state.mobile,'state',this.state.state);
        this.searchLoadData(this.state.mobile,this.state.state);
    }

    /**
     * 渲染搜索框
     */
    renderSearchBar() {
        return (
            <div style={{ display: 'flex', margin: '20px', borderWidth: 1, borderRadius: 4, borderColor: 'rgba(0, 0, 0, 0.15)', borderStyle: 'solid' }}>
                <Form style={{ padding: '30px 40px 30px 40px' }} layout="inline">
                    <Form.Item style={Styles.formItem}>
                        <Input autoComplete="new-password" value={this.state.mobile} onChange={event => this.setState({ mobile: event.target.value })} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户手机号" />
                    </Form.Item>
                    <Form.Item style={Styles.formItem}>
                        <Select defaultValue="-1" style={Styles.formItem} onChange={value => this.onSelectChange(value)}>
                            {Authentication_Status.map(item => <Option key={item['key']} value={item['key']}>{item['value']}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={() => this.searchClick()} htmlType="button"> 搜索</Button>
                    </Form.Item>
                </Form>
            </div>
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
                width: "13%",
            }, {
                title: "姓名",
                dataIndex: 'true_name',
                key: 'true_name',
                width: "12%",
                render: (text, record) => (
                    <a onClick={() => this.props.router.push({ pathname: `/clientinfo/${record['userId']}` })}>{text}</a>
                ),
            },
            {
                title: "手机号",
                dataIndex: 'mobile',
                key: 'mobile',
                width: "15%",
            },
            {
                title: "状态",
                dataIndex: 'audit_state',
                key: 'audit_state',
                width: "15%",
                render: (text, record) => (
                    <p style={record.audit_state == 1 ? { color: 'pink', margin: 0 } : record.audit_state == 2 ? { color: 'green', margin: 0 } : record.audit_state == 3 ? { color: 'red', margin: 0 } : { color: 'black', margin: 0 }}>
                        {record.audit_state == 0 ? '审核中' : record.audit_state == 1 ? '初步审核通过' : record.audit_state == 2 ? '审核通过' : '审核未通过'}
                    </p>
                )
            },
            {
                title: "提交时间",
                dataIndex: 'updated_at',
                key: 'updated_at',
                width: "15%",
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{moment(record['updated_at']).format('YYYY年MM月DD日 HH时mm分')}</p>
                )
            },
            {
                title: "创建时间",
                dataIndex: 'create_time',
                key: 'create_time',
                width: "15%",
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{moment(record['created_at']).format('YYYY年MM月DD日 HH时mm分')}</p>
                )
            }, {
                title: '操作',
                key: 'action',
                width: "15%",
                render: (text, record) => (
                    <span>
                        <Link to={{ pathname: '/authenticationDetails', state: { data: JSON.stringify(record) } }}>详情</Link>
                        <Divider type="vertical" />
                    </span>
                ),
            }];
        return (
            <Table columns={columns} dataSource={this.state.data} rowKey="id" pagination={{
                position: 'bottom', current: this.state.pageIndex, total: this.state.total, pageSize: this.state.pageSize, onChange: (page, pageSize) => {
                    this.searchLoadDataByPage(this.state.mobile,this.state.state,page,pageSize);
                    this.setState({
                        pageIndex: page,
                        pageSize: pageSize
                    });
                }
            }} />
        )
    }
    render() {
        console.log(this.state);
        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', background: '#FFFFFF' }}>
                {/* 搜索框 */}
                {this.renderSearchBar()}
                {/* 认证信息内容 */}
                {this.renderMainList()}
                {/* {this.renderGameTypeList()} */}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId
});

export default connect(mapStateToProps, {})(AuthenticationList);

const Styles = {
    formItem: { width: 180 },
    actionFormItem: { width: 300 },
    label: { fontSize: 14, color: Colors.C1 },
};