/*
 * @Author: fantao.meng 
 * @Date: 2019-03-20 20:28:23 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-01 01:51:57
 */

import { Table, Card, Col, Row } from 'antd';
import { Send } from 'HttpPost';
import { GEM_SOURCE } from 'constantclient';
import { STAR_LEVEL_DETAILS } from 'constantrisk';

export default class ClientTeam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            currentPage: 1,
            totalNumber: 1,
            relationList: [],
            status: 1,
            
            type: 0, // 0、注册类型 1、实名类型

            pushAuthCount: "--",
            pushCount: "--",
            starLevel: "--",
            teamActivity: "--",
            teamBigActivity: "--",
            teamCount: "--",
            teamSmallActivity: "--",
        }
    }

    componentDidMount () {
        this.fetchRelationStatictics();
        this.fetchRelationList(1);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.clientId !== this.props.clientId) {
            this.fetchRelationList(1, nextProps.clientId);
        }
    }

    /**
     * 获取团队统计信息
     */
    fetchRelationStatictics () {
        var that = this;
        Send('User.getRelationStatictics', { clientId: this.props.clientId, _uid: this.props.userId }, response => {
            if (response['success'] && response['data']) {
                let { pushAuthCount, pushCount, starLevel, teamActivity, teamBigActivity, teamCount, teamSmallActivity } = response['data'];
                that.setState({ pushAuthCount, pushCount, starLevel, teamActivity, teamBigActivity, teamCount, teamSmallActivity });
            }
        });
    }

    /**
     * 获取团队列表
     */
    fetchRelationList (page, clientId) {
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('User.getRelationList', { type: this.state.type, page, clientId: clientId || this.props.clientId, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                that.setState({ currentPage: page, relationList: list, totalNumber });
            }
        });
    }

    /**
     * 切换推广运行情况
     */
    onChangeType (type) {
        if (type !== this.state.type) this.setState({ type }, () => this.fetchRelationList(1));
    }

    renderTab () {
        let { pushAuthCount, pushCount, starLevel, teamActivity, teamBigActivity, teamCount, teamSmallActivity } = this.state;
        return (
            <div style={{ background: '#ECECEC' }}>
                <Row gutter={24} style={{ padding: '26px' }}>
                    <Col span={5}>
                        <Card title="星级达人" bordered={false} hoverable>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${starLevel === "--" ? starLevel : STAR_LEVEL_DETAILS[starLevel]['name']}`}</p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={5}>
                        <Card title="团队人数" bordered={false} hoverable>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${teamCount}`}</p>
                                <p style={{ fontSize: 16 }}>{`人`}</p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={5}>
                        <Card title="直推人数" bordered={false} hoverable onClick={() => this.onChangeType(0)} extra={<p style={{ color: '#1890ff' }}>列表</p>}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${pushCount}`}</p>
                                <p style={{ fontSize: 16 }}>{`人`}</p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={5}>
                        <Card title="直推实名人数" bordered={false} hoverable onClick={() => this.onChangeType(1)} extra={<p style={{ color: '#1890ff' }}>列表</p>}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${pushAuthCount}`}</p>
                                <p style={{ fontSize: 16 }}>{`人`}</p>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={24} style={{ padding: '26px', paddingTop: "0px" }}>
                    <Col span={5}>
                        <Card title="团队活跃度" bordered={false} hoverable>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${teamActivity}`}</p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={5}>
                        <Card title="大区活跃度" bordered={false} hoverable>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${teamBigActivity}`}</p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={5}>
                        <Card title="小区活跃度" bordered={false} hoverable>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${teamSmallActivity}`}</p>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }

    renderTable () {
        const columns = [{
                title: '昵称',
                dataIndex: 'nickname',
                key: 'nickname',
                width: '20%',
                render: (text, record) => (
                    <a onClick={() => this.props.router.push({ pathname: `/clientinfo/${record['id']}` })}>{text}</a>
                ),
            },{
                title: '账户',
                dataIndex: 'mobile',
                key: 'mobile',
                width: '20%',
            },{
                title: '钻石余额',
                dataIndex: 'gemNumber',
                key: 'gemNumber',
                width: '20%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${record['gemNumber']}枚`}</p>
                )
            },{
                title: '支付宝',
                dataIndex: 'alipay',
                key: 'alipay',
                width: '20%',
            },{
                title: '注册时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: '20%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${moment(record['createTime']).format('YYYY年MM月DD日 HH时mm分')}`}</p>
                )
            }
        ];
        return (
            <Table columns={columns} dataSource={this.state.relationList}
                rowKey='id'
                loading={this.state.isLoading}
                onChange={(page, pageSize) => this.fetchRelationList(page.current)}
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }} 
            />
        )
    }

    render () {
        return (
            <div>
                {this.renderTab()}
                {this.renderTable()}
            </div>
        )
    }
}