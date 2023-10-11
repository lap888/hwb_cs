/*
 * @Author: fantao.meng 
 * @Date: 2019-02-19 23:13:13 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-05 09:59:15
 */

import { Table, Divider, Form, Input, Select, Icon, Button } from 'antd';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { LOG_ROUTE, LOG_MODULE } from 'constantrisk';
import { Colors } from 'theme';
import { Send } from 'HttpPost';

class RiskLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            logList: [],
            currentPage: 1,
            totalNumber: 1,

            nickname: "",
            method: ""
        }
    }

    componentDidMount() {
        this.fetchLogList(1);
    }

    /**
     * 获取日志列表
     */
    fetchLogList (page) {
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        let { nickname, method } = this.state;
        Send('Risk.logList', { nickname, method, page, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                that.setState({ currentPage: page, logList: list, totalNumber });
            }
        });
    }

    /**
     * 渲染搜索框
     */
    renderSearchBar () {
        let { nickname, method } = this.state;
        return (
            <div style={{ display: 'flex', margin: '20px', borderWidth: 1, borderRadius: 4, borderColor: 'rgba(0, 0, 0, 0.15)', borderStyle: 'solid' }}>
                <Form style={{ padding: '26px 40px 26px 40px' }} layout="inline">
                    <Form.Item style={Styles.formItem}>
                        <Input
                            autoComplete="new-password"
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                            placeholder="操作人员姓名"
                            value={nickname}
                            onChange={e => this.setState({ nickname: e.target.value })} 
                        />
                    </Form.Item>
                    <Form.Item style={Styles.formItem}>
                        <Select defaultValue={method} style={Styles.formItem} onChange={method => this.setState({ method })}>
                            {LOG_MODULE.map(item => <Select.Option key={item['key']} value={item['key']}>{item['value']}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary" 
                            htmlType="submit"
                            onClick={() => this.fetchLogList(1)}> 
                            Search
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }

    /**
     * 渲染日志列表
     */
    renderLogList () {
        const columns = [{
            title: "操作人员",
            dataIndex: 'nickname',
            key: 'nickname',
            width: "150px",
        },{
            title: "角色",
            dataIndex: 'roleName',
            key: 'roleName',
            width: "150px",
        },{
            title: "描述",
            dataIndex: 'id',
            key: 'id',
            width: "400px",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{LOG_ROUTE[record['method']]}</p>
            )
        },{
            title: "访问方法",
            dataIndex: 'method',
            key: 'method',
            width: "200px"
        },{
            title: "原始日志",
            dataIndex: 'params',
            key: 'params',
            width: "1500px",
            render: (text, record) => (
                <p style={{ margin: 0, width: "1500px", overflow: 'hidden' }}>{text}</p>
            )
        },{
            title: "创建时间",
            dataIndex: 'createTime',
            key: 'createTime',
            width: "270px",
            fixed: 'right',
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`${moment(text).format('YYYY年MM月DD日 HH时mm分')}`}</p>
            )
        }];
        return (
            <Table 
                columns={columns}
                loading={this.state.isLoading}
                dataSource={this.state.logList} 
                rowKey='id'
                scroll={{ x: "2670px" }} 
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }} 
                onChange={(page, pageSize) => this.fetchLogList(page.current)}
            />
        )
    }

    render () {
        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', background: '#FFFFFF' }}>
                {this.renderSearchBar()}
                {/* 日志列表 */}
                {this.renderLogList()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId,
});

export default connect(mapStateToProps, {})(RiskLog);

const Styles = {
    formItem: { width: 180 },
    actionFormItem: { width: 260 },
    label: { fontSize: 14, color: Colors.C1 },
};
