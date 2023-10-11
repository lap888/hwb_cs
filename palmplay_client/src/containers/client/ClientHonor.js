/*
 * @Author: fantao.meng 
 * @Date: 2019-03-22 17:59:51 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-04-26 21:38:57
 */

import { Table, Card, Col, Row } from 'antd';
import { Send } from 'HttpPost';

export default class ClientHonor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            currentPage: 1,
            totalNumber: 1,
            contributeList: [],
            status: 1,
            
            honorValue: '--',
        }
    }

    componentDidMount () {
        this.fetchHonorStatictics();
        this.fetchHonorList(1);
    }

    /**
     * 获取矿机统计信息
     */
    fetchHonorStatictics () {
        var that = this;
        Send('User.getHonorStatictics', { clientId: this.props.clientId, _uid: this.props.userId }, response => {
            if (response['success']) {
                let { honorValue } = response['data'];
                that.setState({ honorValue });
            }
        });
    }

    /**
     * 获取矿机列表
     */
    fetchHonorList (page) {
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('User.getHonorList', { page, clientId: this.props.clientId, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                that.setState({ currentPage: page, contributeList: list, totalNumber });
            }
        });
    }

    renderTab () {
        let { honorValue } = this.state;
        return (
            <div style={{ background: '#ECECEC', padding: '26px' }}>
                <Row gutter={24}>
                    <Col span={6}>
                        <Card title="荣誉值" bordered={false} hoverable>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p style={{ fontSize: 26 }}>{`${honorValue}`}</p>
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
                title: '荣誉值来源',
                dataIndex: 'content',
                key: 'content',
                width: '50%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${record['content']}`}</p>
                )
            },{
                title: '数量',
                dataIndex: 'number',
                key: 'number',
                width: '20%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${record['number']}`}</p>
                )
            },{
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: '26%',
                render: (text, record) => (
                    <p style={{ margin: 0 }}>{`${moment(record['createTime']).format('YYYY年MM月DD日 HH时mm分')}`}</p>
                )
            }
        ];
        return (
            <Table columns={columns} dataSource={this.state.contributeList}
                rowKey='id'
                loading={this.state.isLoading}
                onChange={(page, pageSize) => this.fetchHonorList(page.current)}
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