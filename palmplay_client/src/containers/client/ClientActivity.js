/*
 * @Author: fantao.meng 
 * @Date: 2019-03-20 20:28:23 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-16 12:28:59
 */

import { Table, Card, Col, Row } from 'antd';
import { Send } from 'HttpPost';
import MathFloat from 'MathFloat';
import { MINING_TYPE_LIST } from 'constantclient';

export default class ClientActivity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabKey: true,

            isLoading: true,
            currentPage: 1,
            totalNumber: 1,
            baseActicityList: [],
            addActicityList: [],
            
            baseActicity: "--",
            addActicity: "--"
        }
    }

    componentDidMount () {
        this.fetchActiviyStatictics();
        this.fetchBaseActivityList(1);
    }

    /**
     * 获取活跃度统计信息
     */
    fetchActiviyStatictics () {
        var that = this;
        Send('User.getBaseActivityLevel', { clientId: this.props.clientId, _uid: this.props.userId }, response => {
            if (response['success']) {
                let { baseActicity } = response['data'];
                that.setState({ baseActicity });
            }
        });
        Send('User.getAddActivityLevel', { clientId: this.props.clientId, _uid: this.props.userId }, response => {
            if (response['success']) {
                let { addActicity } = response['data'];
                that.setState({ addActicity: MathFloat.floor(addActicity, 2) });
            }
        });
    }

    /**
     * 获取基础活跃度列表
     */
    fetchBaseActivityList (page) {
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('User.getBaseActivityList', { page, clientId: this.props.clientId, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                that.setState({ currentPage: page, baseActicityList: list, totalNumber });
            }
        });
    }

    /**
     * 获取加成活跃度列表
     */
    fetchAddActivityList (page) {
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('User.getAddActivityList', { page, clientId: this.props.clientId, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                that.setState({ currentPage: page, addActicityList: list, totalNumber });
            }
        });
    }

    /**
     * 切换活跃度、提现列表
     */
    onChangeTab (flag) {
        if (this.state.tabKey === flag) return;
        this.setState({ tabKey: flag }, () => {
            if (flag) {
                this.fetchBaseActivityList(1);
            } else {
                this.fetchAddActivityList(1);
            }
        });
    }

    /**
     * 渲染统计信息面板
     */
    renderTab () {
        let { baseActicity, addActicity } = this.state;
        return (
            <div style={{ background: '#ECECEC', padding: '26px' }}>
                <Row gutter={24}>
                    <Col span={6}>
                        <Card title="基础活跃度" bordered={false} hoverable extra={<p style={{ color: '#1890ff' }}>基础记录</p>} onClick={() => this.onChangeTab(true)}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${baseActicity}`}</p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="加成活跃度" bordered={false} hoverable extra={<p style={{ color: '#1890ff' }}>加成记录</p>} onClick={() => this.onChangeTab(false)}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${addActicity}`}</p>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }

    /**
     * 渲染基础活跃度列表
     */
    renderBaseTable () {
        const columns = [
            {
                title: '活跃度来源',
                dataIndex: 'minning_id',
                key: 'minning_id',
                width: '40%',
                render: (text, record) => (
                    <p style={{ margin: 0, color: MINING_TYPE_LIST[text]['color'] }}>{`购买${MINING_TYPE_LIST[text]['minning_name']}增加基础活跃度`}</p>
                )
            },{
                title: '数量',
                dataIndex: 'id',
                key: 'id',
                width: '30%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`+${MINING_TYPE_LIST[record['minning_id']]['activity_level']}`}</p>
                )
            },{
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: '40%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${moment(record['createTime']).format('YYYY年MM月DD日 HH时mm分')}`}</p>
                )
            }
        ];
        return (
            <Table columns={columns} dataSource={this.state.baseActicityList}
                rowKey='id'
                loading={this.state.isLoading}
                onChange={(page, pageSize) => this.fetchBaseActivityList(page.current)}
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }} 
            />
        )
    }

    /**
     * 渲染加成活跃度列表
     */
    renderAddTable () {
        const columns = [
            {
                title: '活跃度来源',
                dataIndex: 'minning_id',
                key: 'minning_id',
                width: '40%',
                render: (text, record) => (
                    <p style={{ margin: 0, color: MINING_TYPE_LIST[text]['color'] }}>{`直推认证会员【${record['nickname']}】${MINING_TYPE_LIST[text]['minning_name']}活跃度加成奖励`}</p>
                )
            },{
                title: '数量',
                dataIndex: 'id',
                key: 'id',
                width: '30%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`+${MINING_TYPE_LIST[record['minning_id']]['activity_level'] * 0.05}`}</p>
                )
            },{
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: '40%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${moment(record['createTime']).format('YYYY年MM月DD日 HH时mm分')}`}</p>
                )
            }
        ];
        return (
            <Table columns={columns} dataSource={this.state.addActicityList}
                rowKey='minningsRecordId'
                loading={this.state.isLoading}
                onChange={(page, pageSize) => this.fetchAddActivityList(page.current)}
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }} 
            />
        )
    }

    render () {
        return (
            <div>
                {this.renderTab()}
                {this.state.tabKey ? this.renderBaseTable() : this.renderAddTable()}
            </div>
        )
    }
}