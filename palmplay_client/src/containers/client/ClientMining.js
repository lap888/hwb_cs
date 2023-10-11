/*
 * @Author: fantao.meng 
 * @Date: 2019-03-20 20:28:23 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-04-27 13:17:17
 */

import { Table, Card, Col, Row } from 'antd';
import { Send } from 'HttpPost';
import { MINING_TYPE_LIST, MINING_SOURCE_LIST } from 'constantclient';

export default class ClientMining extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            currentPage: 1,
            totalNumber: 1,
            miningList: [],
            status: 1,
            
            workingNumber: '--',
            notWorkingNumber: '--',
            collectDays: '--',
            collectNumber: '',
        }
    }

    componentDidMount () {
        this.fetchMiningStatictics();
        this.fetchMeiningList(1);
    }

    /**
     * 获取矿机列表
     */
    fetchMeiningList (page) {
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('User.getMiningList', { status: this.state.status, page, clientId: this.props.clientId, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                that.setState({ currentPage: page, miningList: list, totalNumber });
            }
        });
    }

    /**
     * 获取矿机统计信息
     */
    fetchMiningStatictics () {
        var that = this;
        Send('User.getMiningStatictics', { clientId: this.props.clientId, _uid: this.props.userId }, response => {
            if (response['success']) {
                let { workingNumber, notWorkingNumber, collectDays, collectNumber } = response['data'];
                that.setState({ workingNumber, notWorkingNumber, collectDays, collectNumber });
            }
        });
    }

    /**
     * 切换矿机运行情况
     */
    onChangeStatus (status) {
        if (status !== this.state.status) this.setState({ status }, () => this.fetchMeiningList(1));
    }

    renderTab () {
        let { workingNumber, notWorkingNumber, collectDays, collectNumber } = this.state;
        return (
            <div style={{ background: '#ECECEC', padding: '26px' }}>
                <Row gutter={24}>
                    <Col span={6} onClick={() => this.onChangeStatus(1)}>
                        <Card title="运行矿机" bordered={false} hoverable extra={<p style={{ color: '#1890ff' }}>列表</p>}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${workingNumber}`}</p>
                                <p style={{ fontSize: 16 }}>{`台`}</p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={6} onClick={() => this.onChangeStatus(0)}>
                        <Card title="历史矿机" bordered={false} hoverable extra={<p style={{ color: '#1890ff' }}>列表</p>}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${notWorkingNumber}`}</p>
                                <p style={{ fontSize: 16 }}>{`台`}</p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="累计挖矿天数" bordered={false} hoverable>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${collectDays}`}</p>
                                <p style={{ fontSize: 16 }}>{`天`}</p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="累计收取钻石" bordered={false} hoverable>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${collectNumber.toString().trim() === '' ? '--' : parseInt(collectNumber)}`}</p>
                                <p style={{ fontSize: 16 }}>{`枚`}</p>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }

    renderTable () {
        const columns = [
            {
                title: '矿机类型',
                dataIndex: 'type',
                key: 'type',
                width: '25%',
                render: (text, record) => (
                    <p style={{ margin: 0, color: MINING_TYPE_LIST[record['type']]['color'] }}>{`${MINING_SOURCE_LIST[record['source']]['value']}${MINING_TYPE_LIST[record['type']]['minning_name']}`}</p>
                )
            },{
                title: '生效时间',
                dataIndex: 'beginTime',
                key: 'beginTime',
                width: '25%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${moment(record['beginTime']).format('YYYY年MM月DD日 HH时mm分')}`}</p>
                )
            },{
                title: '过期时间',
                dataIndex: 'endTime',
                key: 'endTime',
                width: '25%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${moment(record['endTime']).format('YYYY年MM月DD日 HH时mm分')}`}</p>
                )
            },{
                title: '运行状态',
                dataIndex: 'status',
                key: 'status',
                width: '25%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${record['status']}`}</p>
                )
            }
        ];
        return (
            <Table columns={columns} dataSource={this.state.miningList}
                rowKey='id'
                loading={this.state.isLoading}
                onChange={(page, pageSize) => this.fetchMeiningList(page.current)}
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