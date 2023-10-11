/*
 * @Author: fantao.meng 
 * @Date: 2019-03-20 20:28:23 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-01 01:17:29
 */

import { Table, Card, Col, Row } from 'antd';
import { Send } from 'HttpPost';
import MathFloat from 'MathFloat'
import { GEM_SOURCE } from 'constantclient';

export default class ClientDiamond extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            currentPage: 1,
            totalNumber: 1,
            diamondList: [],
            status: 1,
            
            freezeGemNum: '--',
            gemNum: '--',
        }
    }

    componentDidMount () {
        this.fetchDiamondStatictics();
        this.fetchDiamondList(1);
    }

    /**
     * 获取矿机列表
     */
    fetchDiamondList (page) {
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('User.getDiamondList', { page, clientId: this.props.clientId, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                that.setState({ currentPage: page, diamondList: list, totalNumber });
            }
        });
    }

    /**
     * 获取矿机统计信息
     */
    fetchDiamondStatictics () {
        var that = this;
        Send('User.getDiamondStatictics', { clientId: this.props.clientId, _uid: this.props.userId }, response => {
            if (response['success']) {
                let { gemNum, freezeGemNum } = response['data'];
                that.setState({ gemNum, freezeGemNum });
            }
        });
    }

    renderTab () {
        let { gemNum, freezeGemNum } = this.state;
        return (
            <div style={{ background: '#ECECEC', padding: '26px' }}>
                <Row gutter={24}>
                    <Col span={8}>
                        <Card title="钻石总额" bordered={false} hoverable>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${gemNum}`}</p>
                                <p style={{ fontSize: 16 }}>{`枚`}</p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="冻结钻石" bordered={false} hoverable>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${freezeGemNum}`}</p>
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
                title: '钻石来源',
                dataIndex: 'source',
                key: 'source',
                width: '20%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${GEM_SOURCE[record['source']]}`}</p>
                )
            },{
                title: '钻石数量',
                dataIndex: 'num',
                key: 'num',
                width: '20%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${MathFloat.floor(record['num'], 8)}`}</p>
                )
            },{
                title: '描述',
                dataIndex: 'description',
                key: 'description',
            },{
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: '20%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${moment(record['createTime']).format('YYYY年MM月DD日 HH时mm分')}`}</p>
                )
            }
        ];
        return (
            <Table columns={columns} dataSource={this.state.diamondList}
                rowKey='id'
                loading={this.state.isLoading}
                onChange={(page, pageSize) => this.fetchDiamondList(page.current)}
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